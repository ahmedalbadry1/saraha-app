import {client} from "../../DB/redis.connection.js"

export const set =async({key,value,ttl})=>{
    if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
    return await client.set(key,value,{EX:ttl})
}

export const get = async ({ key } = {}) => {
  try {
    return JSON.parse(await client.get(key));
  } catch (error) {
    return await client.get(key);
  }
};

export const ttl = async ({ key } = {}) => {
  return await client.ttl(key);
};

export const expire = async ({ key, ttl } = {}) => {
  return await client.expire(key, ttl);
};

export const exists = async ({ key } = {}) => {
  return await client.exists(key);
};

export const keys = async ({ prefix } = {}) => {
  return await client.keys(`${prefix}*`);
};

export const del = async ({ keys } = {}) => {
  return await client.del(keys);
};

export const deleteByPrefix = async ({ prefix } = {}) => {
  const matchedKeys = await keys(`${prefix}*`);
  if (!matchedKeys.length) return 0;
  return await del({ keys: matchedKeys });
};


export const incrBy = async ({ key, increment = 1 } = {}) => {
  return await client.incrBy(key, increment);
};