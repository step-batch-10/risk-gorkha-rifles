#! bin/zsh

curl http://localhost:3000/
curl http://localhost:3000/login -H "Content-type: application/json" -d '{"username":"playerOne"}'
curl http://localhost:3000/game/join-game -d "3"

curl http://localhost:3000/
curl http://localhost:3000/login -H "Content-type: application/json" -d '{"username":"playerTwo"}'
curl http://localhost:3000/game/join-game -d "3"

curl http://localhost:3000/
curl http://localhost:3000/login -H "Content-type: application/json" -d '{"username":"playerThree"}'
curl http://localhost:3000/game/join-game  -d "3"

