export async function notifyNewPendingServer(opts: {
    ip: string
    port?: number | null
    serverName?: string | null
    gametype?: string | null
    currentState?: string | null
    playerCount?: number | null
    maxPlayers?: number | null
    currentMap?: string | null
    addedBy?: string | null
    isAutoDiscovered?: boolean
}) {
    const webhookUrl = process.env.DISCORD_SERVER_WHITELIST_WEBHOOK_URL
    if (!webhookUrl) return

    const {
        ip, port, serverName, gametype, currentState,
        playerCount, maxPlayers, currentMap, addedBy,
        isAutoDiscovered = false,
    } = opts

    const ipPort = port ? `${ip}:${port}` : ip
    const displayName = serverName && serverName !== "New Discovery" ? serverName : null

    const fields: Array<{ name: string; value: string; inline: boolean }> = []
    if (gametype) fields.push({ name: "Gametype", value: gametype, inline: true })
    if (currentState) fields.push({ name: "Status", value: currentState, inline: true })
    if (playerCount != null && maxPlayers != null) {
        fields.push({ name: "Players", value: `${playerCount}/${maxPlayers}`, inline: true })
    }
    if (currentMap) fields.push({ name: "Map", value: currentMap, inline: true })
    if (addedBy) fields.push({ name: "Added By", value: addedBy, inline: true })
    fields.push({
        name: "Action",
        value: "[Review in Admin Panel](https://www.bf1942.online/admin/whitelist)",
        inline: false,
    })

    const payload = {
        username: "BF1942 Whitelist",
        embeds: [{
            title: isAutoDiscovered ? "🔍 New Server Discovered" : "➕ Server Added to Whitelist",
            description: displayName ? `**${displayName}**\n\`${ipPort}\`` : `\`${ipPort}\``,
            color: isAutoDiscovered ? 0xF59E0B : 0x22C55E,
            fields,
            timestamp: new Date().toISOString(),
            footer: { text: "bf1942.online" },
        }],
    }

    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(5000),
        })
    } catch (e) {
        console.error("[discord] server notification failed:", e)
    }
}
