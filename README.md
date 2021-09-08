# tweetit api

tweetit is a microblogging platform where users post or tweets

[![docs](https://img.shields.io/badge/Documentation-see%20docs-green?style=for-the-badge&logo=appveyor)](https://documenter.getpostman.com/view/14486984/U16huT6f)
[![link](https://img.shields.io/badge/deployed%20link-visit-orange?style=for-the-badge&logo=appveyor)](https://tweetit-api.herokuapp.com/)

## features

- signup/login
- update profile
- view other users profile
- follow or unfollow other users
- tweet with hashtags
- get timeline feeds by tweets from users they follow

## technologies used

- runtime: node.js
- framework: express.js
- databases: postgresql (primary), redis (caching)
- query builder: knex
- mq service: bullmq

## system overview

!["system-overview"](https://drive.google.com/uc?export=view&id=1MJt9sh1ZIFrA_O4ixnxlmIRwZ1NJS9pq)

## database schema

- user table

  | column      | type       | attributes  |
  | ----------- | ---------- | ----------- |
  | id          | uuid       | primary key |
  | name        | string     | not null    |
  | username    | string     | unique      |
  | email       | string     | unique      |
  | phone       | bigint     |             |
  | location    | string     |             |
  | avatar      | string     |             |
  | bio         | string     |             |
  | created_at  | timestamps |             |
  | updated_at  | timestamps |             |
  | last_active | timestamps |             |

- follow table

  | column      | type       | attributes          |
  | ----------- | ---------- | ------------------- |
  | id          | uuid       | primary key         |
  | followerId  | uuid       | foreign key user.id |
  | followingId | uuid       | foreign key user.id |
  | created_at  | timestamps |                     |
  | updated_at  | timestamps |                     |

- tweet table

  | column     | type       | attributes           |
  | ---------- | ---------- | -------------------- |
  | id         | uuid       | primary key          |
  | text       | string     | not null, length 140 |
  | isPinned   | boolean    | default false        |
  | authorId   | uuid       | foreign key user.id  |
  | created_at | timestamps |                      |
  | updated_at | timestamps |                      |

- tag table

  | column     | type       | attributes    |
  | ---------- | ---------- | ------------- |
  | id         | uuid       | primary key   |
  | tag        | string     | not null      |
  | isPinned   | boolean    | default false |
  | hits       | int        | default 1     |
  | created_at | timestamps |               |
  | updated_at | timestamps |               |

- tweet_tag table

  | column     | type       | attributes         |
  | ---------- | ---------- | ------------------ |
  | id         | uuid       | primary key        |
  | tagId      | uuid       | foreign key tag.id |
  | created_at | timestamps |                    |
  | updated_at | timestamps |                    |

## running locally

- pre requisites

  - node.js + npm
  - postgresql
  - redis

- setup/install

```bash
$ git clone https://github.com/ritiksr25/tweetit-api
$ cd tweetit-api
$ touch .env
$ cp .env.example .env
# Set values in .env
$ npm i # or yarn
$ npm run migrate:latest # or yarn run migrate:latest
```

- execute

```bash
$ npm run dev # or yarn run dev
```
