import { Server } from 'socket.io';
import { Player, Room, RoomConfig, RoomStatus } from '../types/game.types.js';
import { endGame } from '../utils/game-logic.js';
import {
  rooms,
  playerRooms,
  playerTimers,
  roomTimers,
} from '../state/game-state.js';
import { Difficulty } from '../types/question.enum.js';

export const createRoom = (
  socketId: string,
  username: string,
  roomName: string,
  avatarId?: number,
  config?: {
    timeLimit?: number;
    Difficulty?: Difficulty;
    maxPlayers?: number;
    attackDamage?: number;
    healAmount?: number;
    wrongAnswerPenalty?: number;
    isPublic?: boolean;
  }
) => {
  const roomId = Math.floor(100000 + Math.random() * 900000).toString();
  const player: Player = {
    id: socketId,
    username,
    avatarId: avatarId || 1, // Default to 1 if not provided
    health: 0,
    score: 0,
    currentQuestionIndex: 0,
    isHost: true,
  };

  const room: Room = {
    id: roomId,
    name: roomName,
    hostId: socketId,
    players: [player],
    config: {
      timeLimit: config?.timeLimit || 60,
      Difficulty: config?.Difficulty || Difficulty.MEDIUM,
      maxPlayers: config?.maxPlayers || 4,
      attackDamage: config?.attackDamage || 5,
      healAmount: config?.healAmount || 3,
      wrongAnswerPenalty: config?.wrongAnswerPenalty || 3,
      isPublic: config?.isPublic || false,
    },
    status: RoomStatus.WAITING,
  };

  rooms.set(roomId, room);
  playerRooms.set(socketId, roomId);

  return room;
};

export const joinRoom = (
  socketId: string,
  roomId: string,
  username: string,
  avatarId?: number
) => {
  const room = rooms.get(roomId);
  if (!room) return null;

  if (room.status !== RoomStatus.WAITING) return 'IN_PROGRESS';
  if (room.players.length >= room.config.maxPlayers) return 'FULL';

  const player: Player = {
    id: socketId,
    username,
    avatarId: avatarId || 1, // Default to 1 if not provided
    health: 0,
    score: 0,
    currentQuestionIndex: 0,
    isHost: false,
  };

  room.players.push(player);
  playerRooms.set(socketId, roomId);

  return room;
};

export const leaveRoom = (socketId: string, io: Server) => {
  try {
    const roomId = playerRooms.get(socketId);
    if (!roomId) return null;

    const room = rooms.get(roomId);
    if (!room) return null;

    // Remove player from room
    room.players = room.players.filter((p: Player) => p.id !== socketId);

    // If host leaves, assign a new host or delete the room
    if (socketId === room.hostId) {
      if (room.players.length > 0) {
        room.hostId = room.players[0].id;
        room.players[0].isHost = true;
      } else {
        // Clear room timer if it exists
        if (roomTimers.has(roomId)) {
          clearInterval(roomTimers.get(roomId)!);
          roomTimers.delete(roomId);
        }

        rooms.delete(roomId);
      }
    }

    playerRooms.delete(socketId);

    // Stop player timer if exists
    if (playerTimers.has(socketId)) {
      clearInterval(playerTimers.get(socketId)!);
      playerTimers.delete(socketId);
    }

    // Check if game is over for remaining players
    if (rooms.has(roomId) && room.status === RoomStatus.IN_PROGRESS) {
      const alivePlayers = room.players.filter((p: Player) => p.health > 0);
      if (alivePlayers.length <= 1) {
        endGame(roomId, io);
      }
    }

    return { roomId, roomStillExists: rooms.has(roomId) };
  } catch (error) {
    console.error(`Error in leaveRoom for socket ${socketId}:`, error);
    return null;
  }
};

export const updateRoomSettings = (
  socketId: string,
  roomId: string,
  config: RoomConfig
) => {
  const room = rooms.get(roomId);
  if (!room) return null;

  if (socketId !== room.hostId) return 'NOT_HOST';

  // Update config
  room.config = { ...room.config, ...config };

  return room;
};

export const quickJoin = (
  socketId: string,
  username: string,
  avatarId?: number
) => {
  // Create an array of all available public rooms
  const availableRooms: Room[] = [];

  for (const [, room] of rooms) {
    // Only include rooms that are:
    // 1. Public
    // 2. In waiting status
    // 3. Not full
    if (
      room.config.isPublic &&
      room.status === RoomStatus.WAITING &&
      room.players.length < room.config.maxPlayers
    ) {
      availableRooms.push(room);
    }
  }

  // If no rooms are available, return null
  if (availableRooms.length === 0) {
    return null;
  }

  // Sort rooms by number of open slots (maxPlayers - currentPlayers)
  // Rooms with fewer open slots have higher priority (will be joined first)
  availableRooms.sort((a, b) => {
    const aOpenSlots = a.config.maxPlayers - a.players.length;
    const bOpenSlots = b.config.maxPlayers - b.players.length;
    return aOpenSlots - bOpenSlots;
  });

  // Get the highest priority room (smallest number of open slots)
  const roomToJoin = availableRooms[0];

  // Join the room using the existing joinRoom function
  return joinRoom(socketId, roomToJoin.id, username, avatarId);
};

export const deleteRoom = (socketId: string, roomId: string) => {
  try {
    const room = rooms.get(roomId);
    if (!room) return null;

    // Only the host can delete a room
    if (socketId !== room.hostId) return 'NOT_HOST';

    // Clear room timer if it exists
    if (roomTimers.has(roomId)) {
      clearInterval(roomTimers.get(roomId)!);
      roomTimers.delete(roomId);
      console.log(`Cleared room timer for room ${roomId}`);
    }

    // Remove all players from the room
    room.players.forEach((player) => {
      playerRooms.delete(player.id);

      // Stop player timer if exists
      if (playerTimers.has(player.id)) {
        clearInterval(playerTimers.get(player.id)!);
        playerTimers.delete(player.id);
        console.log(`Cleared player timer for player ${player.id}`);
      }
    });

    // Delete the room
    rooms.delete(roomId);

    return { roomId };
  } catch (error) {
    console.error(`Error in deleteRoom for room ${roomId}:`, error);
    return null;
  }
};

export const continueGame = (socketId: string, roomId: string) => {
  try {
    const room = rooms.get(roomId);
    if (!room) return null;

    // Only the host can continue the game
    if (socketId !== room.hostId) return 'NOT_HOST';

    // Room must be in FINISHED state to continue
    if (room.status !== RoomStatus.FINISHED) return 'INVALID_STATE';

    // Reset player health, scores, and elimination tracking for a new game
    room.players.forEach((player) => {
      player.health = 0;
      player.score = 0;
      player.currentQuestionIndex = 0;
      player.eliminationTime = undefined; // Clear elimination time tracking
    });

    // Set the room status back to WAITING
    room.status = RoomStatus.WAITING;

    return room;
  } catch (error) {
    console.error(`Error in continueGame for room ${roomId}:`, error);
    return null;
  }
};
