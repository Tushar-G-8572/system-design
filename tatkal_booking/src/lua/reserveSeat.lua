local seatKey   = KEYS[1]
local userId    = ARGV[1]
local requestId = ARGV[2]
local ttl       = tonumber(ARGV[3])

local seat = redis.call("GET", seatKey)

if not seat then
    return -1
end

if seat == "available" then

    redis.call("SET", seatKey, "held" ..userId)

    redis.call(
        "SETEX",
        "lock:" .. seatKey,
        ttl,
        requestId
    )

    return 1
end

return 0