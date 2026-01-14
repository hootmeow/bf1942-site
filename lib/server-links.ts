export interface ServerCommunityLinks {
    website?: string;
    discord?: string;
}

export const SERVER_LINKS: Record<number, ServerCommunityLinks> = {
    // Moongamers
    5: {
        website: "https://www.moongamers.com/forum/",
        discord: "http://moon-discord.sytes.net/",
    },

    // Team Simple (Multiple Servers)
    41: { website: "https://team-simple.org/forum/", discord: "https://discord.gg/w35q7AYD" },
    37: { website: "https://team-simple.org/forum/", discord: "https://discord.gg/w35q7AYD" },
    32: { website: "https://team-simple.org/forum/", discord: "https://discord.gg/w35q7AYD" },
    38: { website: "https://team-simple.org/forum/", discord: "https://discord.gg/w35q7AYD" },

    // HelloClan (Multiple Servers)
    11: { website: "https://www.helloclan.eu/", discord: "https://discord.gg/helloclan-the-social-gaming-network-276061597636624395" },
    6: { website: "https://www.helloclan.eu/", discord: "https://discord.gg/helloclan-the-social-gaming-network-276061597636624395" },
    50: { website: "https://www.helloclan.eu/", discord: "https://discord.gg/helloclan-the-social-gaming-network-276061597636624395" },
    7: { website: "https://www.helloclan.eu/", discord: "https://discord.gg/helloclan-the-social-gaming-network-276061597636624395" },

    // JDRGaming
    31: {
        website: "https://jdrgaming.com/tpu/",
        discord: "https://discord.gg/kvg9mfX",
    },

    // Server 28
    28: {
        website: "https://usa-bf1942.proboards.com/",
    },
};
