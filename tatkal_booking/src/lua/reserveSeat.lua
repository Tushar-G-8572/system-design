local seatKey   = KEYS[1]
local lockKey   = "lock:" .. seatKey
local userId    = ARGV[1]
local requestId = ARGV[2]
local ttl       = tonumber(ARGV[3])

local seat = redis.call("GET", seatKey)
if not seat then
    return -1  -- never seeded, doesn't exist
end

local lockActive = redis.call("EXISTS", lockKey)

if seat == "available" or lockActive == 0 then
    redis.call("SET", seatKey, "held:" .. userId)
    redis.call("SET", lockKey, requestId, "EX", ttl)
    return 1
end

return 0