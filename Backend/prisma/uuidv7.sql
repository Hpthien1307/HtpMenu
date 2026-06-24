CREATE OR REPLACE FUNCTION uuid_generate_v7()
RETURNS uuid AS $$
DECLARE
  timestamp_ms bigint;
  bytes bytea;
BEGIN
  -- Get current timestamp in milliseconds
  timestamp_ms := floor(extract(epoch from clock_timestamp()) * 1000)::bigint;
  -- Hex representation of timestamp (12 hex chars = 6 bytes) padded to 12 chars
  -- Concatenated with 10 random bytes (gen_random_bytes(10))
  bytes := decode(lpad(to_hex(timestamp_ms), 12, '0'), 'hex') || gen_random_bytes(10);
  -- Set version to 7 (bits 4-7 of 6th byte to 0111)
  bytes := set_byte(bytes, 6, (get_byte(bytes, 6) & 15) | 112);
  -- Set variant to 1 (bits 6-7 of 8th byte to 10xx)
  bytes := set_byte(bytes, 8, (get_byte(bytes, 8) & 63) | 128);
  RETURN encode(bytes, 'hex')::uuid;
END;
$$ LANGUAGE plpgsql VOLATILE;
