const mongoose = require('mongoose');
const player = mongoose.model('players');
const foe = mongoose.model('foes');
const roster = mongoose.model('roster');
const songbook = mongoose.model('songbook');
const song = mongoose.model('song');
const feedItem = mongoose.model('feedItem');
const channel = mongoose.model('channels');
const Users = mongoose.model('User');

const env = require('dotenv');
const passport  = require('passport');
const jwt = require('jsonwebtoken');

env.config();

const generateToken = (payload, key, expires) => jwt.sign(payload, key, {
  expiresIn: expires,
});

const { gql, AuthenticationError, ApolloError } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        i18n: Langs
        players: [Player]!
        player(id: ID!): Player
        rosters: [Roster]!
        rostersActive: [Roster]!
        roster(id: ID!): Roster
        foes: [Foe]!
        foe(id: ID!): Foe
        songbooks: [Songbook]!
        songbook(id: ID!): Songbook
        songs: [Song]!
        song(id: ID!): Song
        feed: [FeedItem]!
        feedAll: [FeedItem]!
        feedItem(id: ID!): FeedItem!
        channels: [Channel]!
        channelsAll: [Channel]!
        channel: Channel!
        users: [User]!
        user(id: ID!): User
    }

    type Mutation {
        login(email: String!, password: String!): UserLoginType
    }

    type Langs {
        langs: [String]
    }

    type Player @cacheControl(maxAge: 900) {
        id: ID!
        name: String!
        flag: String
        squadNumber: String
        position: String
        team: String
        thumbnail: String
        twitter: String
        instagram: String
        images: [String]
        # TODO: Add bio's
        # bio:
    }

    # type PlayerBio {

    # }

    type Roster @cacheControl(maxAge: 900) {
        id: ID!
        rosterTitle: String
        season: String
        defaultThumbnail: String
        defaultImage: String
        players: [RosterPlayer]
        active: Boolean
        default: Boolean
    }

    type RosterPlayer {
        _id: ID!
        hint: String
    }

    type Foe @cacheControl(maxAge: 900) {
        id: ID!
        opponent: String
        logo: String
        backgroundColor: String
        accentColor: String
        textColor: String
        season: String
        active: Boolean
        players: [FoePlayer]
    }

    type FoePlayer {
        name: String
        squadNumber: String
        position: String
    }

    type Songbook @cacheControl(maxAge: 900) {
        id: ID!
        songbook_title: String
        organization: String
        description: String
        front_cover: String
        back_cover: String
        chapters: [SongbookChapter]
    }

    type SongbookChapter {
        chapter_title: String
        songs: [SongbookChapterSong]
    }

    type SongbookChapterSong {
        _id: String
        featured: Boolean
        hint: String
    }

    type Song @cacheControl(maxAge: 900) {
        id: ID!
        title: String
        category: String
        instructions: String
        lyrics: String
        referenceTitle: String
        referenceLink: String
        sheetMusicLik: String
        playerId: String
        legend: String
        capoSignal: String
    }

    type FeedItem @cacheControl(maxAge: 900) {
        id: ID!
        sender: Sender
        publishedAt: String
        push: Boolean
        local: String
        text: String
        images: [FeedItemImage]
        attachments: [FeedItemAttachment]
        active: String
        channel: String
    }

    type FeedItemImage {
        uri: String
        thumbnailUri: String
        metadata: FeedItemMetadata
    }

    type FeedItemMetadata {
        caption: String
        credit: String
    }

    type FeedItemAttachment {
        attachmentType: String
        relatedId: String
    }

    type Sender {
        user: User
        pushToken: String
    }

    type Channel @cacheControl(maxAge: 900) {
        id: ID!
        name: String
        defaultLocale: String
        description: String
        avatarUrl: String
        headerUrl: String
        follow: Boolean
        active: Boolean
        users: [ChannelUserType]
    }

    type ChannelUserType {
        _id: ID!
        canCreate: Boolean
        canEdit: Boolean
        canDelete: Boolean
        canPush: Boolean
    }

    type User @cacheControl(maxAge: 900) {
        id: ID!
        email: String
        name: String
        familyName: String
        displayName: String
        pushNotificationsAllowed: Boolean
        rosterAllowed: Boolean
        songbookAllowed: Boolean
        foesAllowed: Boolean
        feedAllowed: Boolean
        usesAllowed: Boolean
        lastLogin: String
        fullname: String
    }

    type UserLoginType {
        token: String!
        user: User!
    }
`;

const resolvers = {
    Query: {
        i18n: () => {
            // TODO: Find out why this isn't working
            const langs = JSON.parse(process.env.INPUT_LANGUAGES);
            console.log(...langs)
            if (langs.length) {
                return [...langs]
            }
            return langs;
        },
        players: async () => {
            console.log('Hello from players');
            return await player.find({});
        },
        player: async (_, { id }) => {
            console.log(`Hello from player: ${id}`)
            return await player.findById(id);
        },
        foes: async () => {
            return await foe.find({});
        },
        foe: async (_, { id }) => {
            return await foe.findById(id);
        },
        rosters: async () => {
            return await roster.find({});
        },
        rostersActive: async () => {
            return await roster.find({ active: true })
        },
        roster: async (_, { id }) => {
            return await roster.findById(id);
        },
        songbooks: async () => {
            return await songbook.find({});
        },
        songbook: async (_, { id }) => {
            return await songbook.findById(id);
        },
        songs: async () => {
            return await song.find({});
        },
        song: async (_, { id }) => {
            return await song.findById(id);
        },
        feed: async () => {
            let feedItems = await feedItem.find({ active: true })
            return feedItems;
        },
        feedAll: async () => {
            return await feedItem.find({});
        },
        feedItem: async (_, { id }) => {
            return await feedItem.findById(id);
        },
        channels: async () => {
            return await channel.find({ active: true });
        },
        channelsAll: async () => {
            return await channel.find({});
        },
        channel: async (_, { id }) => {
            return await channel.findById(id);
        },
        users: async () => {
            return await Users.find({});
        },
        user: async (_, { id }) => {
            return await Users.findById(id);
        }
    },
    Mutation: {
        login: async (_, { email, password }, {req: { req }, res}) => {
            let user = await Users.findOne({ email })
            if (!user) {
                return new AuthenticationError("No user with that email");
            }
            let match = await user.comparePassword(password);
            if (!match) {
                return new AuthenticationError("Invalid email or password");
            }
            let payload = {
                id: user._id
            }

            const secretOrKey = process.env.SECRET_KEY;
            const tokenExpires = process.env.TOKEN_EXPIRES ? `${process.env.TOKEN_EXPIRES}` : '1h';
            const refreshExpires = process.env.REFRESH_TOKEN_EXPIRES ? `${process.env.REFRESH_TOKEN_EXPIRES}` : '1d';
            let token = generateToken(payload, secretOrKey, tokenExpires);
            if (req.body.rememberMe) {
                token = generateToken(payload, secretOrKey, refreshExpires);
            }
            return {
                token,
                user,
            };
        }
    }
}

module.exports = {
    typeDefs,
    resolvers
}
