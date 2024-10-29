# TravelIt

## About

TravelIt is an interactive, collaborative planner app that allows you to create an itenerary for your travel adventure, and invite friends to collaborate on it.

![screenshot](/docs/screencaps/img.png)

### Features

- User accounts (credentials, Google Auth)
- Create an adventure by giving it a name, duration and description
- Create/delete different event types on the calendar (food, activity, accommodation, travel)
- Create notes for a specific event
- Users can post comments in a single thread on an event
- Invite users to collaborate by entering their e-mail
- Be notified when you have been invited to collaborate

## Tech Stack

- NextJS, React-Typescript
- MongoDb
- [react-big-calendar](https://www.npmjs.com/package/react-big-calendar) - the calendar library used.
- Google Maps geolocation

## Dev environment setup

### Environment variables

- `GOOGLE_CLIENT_ID`= # See google cloud console
- `GOOGLE_CLIENT_SECRET`= # See google cloud console
- `NEXTAUTH_SECRET`= #random characters you can create to use for the JWT
- `MONGODB_URI`= # mongo connection string
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`=See google cloud console

### Setup

- Clone repo, run `npm i` to install dependencies
- Create `.env` file at top level of the repo.
- Setup a mongoDb instances if you haven't already (Atlas is preferred)
- Enable google APIs including Maps and Oauth. Obtain relavent API keys from those services

- Run the dev environment with `npm run dev`

## Our Team

- David Eastmond (Developer) [GitHub](https://github.com/davideastmond) / [LinkedIn](https://www.linkedin.com/in/david-eastmond-2783ab18a/)
- Brian Stasiukaitis (Developer) [GitHub](https://github.com/BrianStas) / [LinkedIn](https://www.linkedin.com/in/brian-stasiukaitis)
- Yhormi A (Scrum Master) [GitHub](https://github.com/LootingMonk) / [LinkedIn](https://www.linkedin.com/in/yomiajayi/)
