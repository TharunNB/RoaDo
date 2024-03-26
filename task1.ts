interface Session {
    userId: string;
    session_start: number;
    session_end: number | null; 
    lastSeen: number;
}

function mergeSessions(users: User[]): Session[] {
    const sessions: Session[] = [];

    users.forEach(user => {
        const { userId, logged_in, logged_out, lastSeenAt } = user;

        let session_start = logged_in[0];
        let session_end: number | null = logged_out[0];
        let lastSeen = lastSeenAt[0];

        for (let i = 1; i < logged_in.length; i++) {
            if (logged_in[i] <= (session_end !== null ? session_end : Infinity) || logged_out[i] === null) {
                session_end = Math.max(session_end !== null ? session_end : 0, logged_out[i]); 
            } else {
                sessions.push({ userId, session_start, session_end, lastSeen });
                session_start = logged_in[i];
                session_end = logged_out[i];
            }

            lastSeen = Math.max(lastSeen, lastSeenAt[i]);
        }

        sessions.push({ userId, session_start, session_end, lastSeen });
    });

    return sessions;
}

//Logged in 

function getMonthlyLoggedInUsers(sessions: Session[], month: number, year: number):  Set<string> {
    const loggedInUsers: Set<string> = new Set();

    sessions.forEach(session => {
        const sessionDate = new Date(session.session_start);
        if (sessionDate.getMonth() === month && sessionDate.getFullYear() === year) {
            loggedInUsers.add(session.userId);
        }
    });

    return loggedInUsers;
}

//Active Users 

function getActiveUsers(sessions: Session[]):  Set<string> {
    const activeUsers: Set<string> = new Set();
    const currentDate = new Date();

    sessions.forEach(session => {
        const lastSeenDate = new Date(session.lastSeen);
        const daysDifference = Math.floor((currentDate.getTime() - lastSeenDate.getTime()) / (1000 * 3600 * 24));

        if (daysDifference <= 30) {
            activeUsers.add(session.userId);
        }
    });

    return activeUsers;
}

const sessions = mergeSessions(user_log);

const monthlyLoggedInUsers = getMonthlyLoggedInUsers(sessions, month, year);

const activeUsers = getActiveUsers(sessions);