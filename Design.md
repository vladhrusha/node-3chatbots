# npm packages used

"devDependencies": {
"eslint": "^8.39.0",
"eslint-config-prettier": "^8.8.0",
"eslint-config-standard": "^17.0.0",
"eslint-plugin-import": "^2.27.5",
"eslint-plugin-n": "^15.7.0",
"eslint-plugin-prettier": "^4.2.1",
"eslint-plugin-promise": "^6.1.1",
"husky": "^8.0.3",
"lint-staged": "^13.2.1",
"prettier": "^2.8.8"
},
"dependencies": {
"dotenv": "^16.0.3",
"express": "^4.18.2",
"node-telegram-bot-api": "^0.61.0"
}

![alt text](./sequenceDiagram.png)
@startuml
title Telegram Bot + Heroku Sequence Diagram

Heroku -> TelegramBotServer: set webhook
User -> TelegramBotChannel: /command
TelegramBotChannel -> TelegramBotServer: HTTP POST request with "/command"
TelegramBotServer -> Heroku: HTTP POST request with "/command"
Heroku -> Express: HTTP POST request with "/command"
Express -> Bot: processUpdate(request.body)
Bot -> TelegramBotServer: HTTP POST response
TelegramBotServer -> TelegramBotChannel: Response from Telegram server
TelegramBotChannel -> User: response to "/command"
@enduml

![alt text](./holidayBot_sequenceDiagram.png)

@startuml
title Telegram Bot + Heroku + HolidayAPI Sequence Diagram

Heroku -> TelegramBotServer: set webhook
User -> TelegramBotChannel: message
TelegramBotChannel -> TelegramBotServer: HTTP POST request with user message
TelegramBotServer -> Heroku: HTTP POST request with user message
Heroku -> Bot: HTTP POST request with user message
Heroku -> TelegramBotServer: acknowledge request
Bot -> HolidayApi: request holiday data
HolidayApi -> Bot: response with data
Bot -> TelegramBotServer: HTTP POST response
TelegramBotServer -> TelegramBotChannel: Response from Telegram server
TelegramBotChannel -> User: response to user message
@enduml

![alt text](./forecastBot_sequenceDiagram.png)

@startuml
title Telegram Bot + Heroku + OpenWeatherAPI Sequence Diagram

Heroku -> TelegramBotServer: set webhook
User -> TelegramBotChannel: require weather report
TelegramBotChannel -> TelegramBotServer: HTTP POST request with user message
TelegramBotServer -> Heroku: HTTP POST request with user message
Heroku -> Bot: HTTP POST request with user message
Heroku -> TelegramBotServer: acknowledge request
Bot-> TelegramBotServer : request geolocation
TelegramBotServer -> TelegramBotChannel: send geolocation input
TelegramBotChannel -> User: display geolocation input
User -> TelegramBotChannel: allow geolocation collection
TelegramBotChannel -> TelegramBotServer: send geolocation data
TelegramBotServer -> Heroku: send geolocation data
Heroku -> Bot: HTTP POST with geolocation data
Heroku -> TelegramBotServer: acknowledge getting geolocation data
Bot -> HolidayApi: request weather data
HolidayApi -> Bot: response with weather data
Bot -> TelegramBotServer: HTTP POST responses with weather
TelegramBotServer -> TelegramBotChannel: Response from Telegram server
TelegramBotChannel -> User: response with weather report
@enduml
