## Fill in the Math
Welcome to Fill in the math, an online arithmetic battle royale created by Group B8 for CSCI3100!

## Quick Start
1. Clone Repository  
```bash
git clone https://github.com/listenrwt/fill-in-the-math-server.git
```  
  

2. Navigate to project folder  
```bash
cd fill-in-the-math-server
```
  

3. Install dependencies using yarn  
```bash
npm install
# or
yarn install
```
  

4. Run Development server  
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Remember to run both the server and the client simultaneously for it to work. Link to client repository: https://github.com/listenrwt/fill-in-the-math-client  
  
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## How to play?

**Create Account (Optional)**

After landing on the server, players can first create an account/ log in by clicking the "Log In" button on the top right hand corner. Player can also player as Guest mode.
<img width="1280" alt="Create Account" src="https://github.com/user-attachments/assets/0bc42e1e-273a-4e12-9fa7-b9fef4db463f" />

After entering the login pge, player can now choose to login to existing account, or register a new account by clicking the "Don't have an account? Register button".
<img width="1280" alt="Login" src="https://github.com/user-attachments/assets/55fa0b51-60d6-4e81-abe3-ba72591ac59d" />

**User Settings**

after pressing the settings button, the player will be redirected to the settings page. Player can change their username, password, avatar, or delete his/ her account here. 
<img width="1280" alt="Settings" src="https://github.com/user-attachments/assets/c0632513-ca46-4691-95cc-ad0769d6da64" />


**Joining a game**  

Upon being greeted by the lobby, you can choose to either "Quick Join", "Host Game", or "Join Game". The first option
is the quickest way to hop into a random game, the second and third option is for playing with friends, where you can
either host a game for you or your friends or join a game your friend is hosting via entering the room code.
<img width="1280" alt="Join Game" src="https://github.com/user-attachments/assets/3d548840-02cc-409c-b308-16e76cff307c" />


**Game Hosting**

After clicking "Host Game" button in lobby, a new game session is created and other players can join the game with the room code. 
If "Allow public join" option is allowed, other players can join via "Quick Join". 
Host of game can change the settings (i.e. Heal Amount/ Attack Damage/ Time Limit/ Difficulty/ Wrong answer penalty)
The host can start the game by clicking the "Start Game" button on the bottom.
<img width="1280" alt="Game Hosting" src="https://github.com/user-attachments/assets/5ea22ff0-1ab2-40bd-b7b2-f133f3df7ef0" />


**Objective**  

The objective of the game is to be the last man standing.  

**Puzzles**  

The way to become the last man standing is by completing arithmetic puzzles where the blanks must be filled in with the number pad without repetition.  
<img width="1280" alt="Game Page" src="https://github.com/user-attachments/assets/43048c1f-b4b8-46cf-855c-1afa2142f015" />


**Attacking and defending**  

Upon completing arithmetic puzzles, you can heal yourself by extending your timer, or attacking other players by diminishing theirs. 
<img width="1280" alt="Game Action" src="https://github.com/user-attachments/assets/0dc878ff-5aaf-4868-90b2-6d7fa0d523ef" />

**Health**  

A players health diminishes as steadily as time goes on, and can only be further depleted by attacks from other players or replenished via self-healing. If your Health is under 20 points, you will be notifiied with a yellow/ red glow effect.

**Winning**  

A game is won when all other players are eliminated (health dropped to 0).
<img width="1280" alt="Score Board" src="https://github.com/user-attachments/assets/8ef889a5-ad1a-46d0-9004-261249919ec4" />


Good Luck, Have Fun!


## 📄 License

This project is licensed under the [MIT License](https://github.com/listenrwt/fill-in-the-math-server/blob/master/LICENSE)

## Admin
You can monitor the server resources through admin page.
<img width="1680" alt="Admin Page" src="https://github.com/user-attachments/assets/40ab1f9e-8f21-4c88-8383-c42c596d204d" />


## Credits
Sam [github](https://github.com/sam1037)  
Jackson [github](https://github.com/jacksonhk)  
Winter [github](https://github.com/listenrwt)  
Ming [github](https://github.com/kamingkwok2015)  
Jonathan [github](https://github.com/jonathanc1002)
