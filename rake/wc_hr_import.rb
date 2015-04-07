require 'httparty'
require "pp"
require_relative 'wc_hrs'
require_relative 'wc_snitches'

# adds HR and SNITCH to each game

# use after to do this later
games = HTTParty.get("http://quidapi.herokuapp.com/games").parsed_response
refs = HTTParty.get("http://quidapi.herokuapp.com/people").parsed_response

names = {}

refs.each do |r|
  names[r['name']] = r['_id']
end

games.each_with_index do |g, i|
  # puts g
  payload = {id: g['_id'], hr: names[@hrs[i]]}
  r = HTTParty.put("http://quidapi.herokuapp.com/games/hr", body: payload, query: ENV['QUID_API_KEY'])
  payload = {id: g['_id'], hr: names[@snitches[i]]}
  r = HTTParty.put("http://quidapi.herokuapp.com/games/snitch", body: payload, query: ENV['QUID_API_KEY'])
  puts r
end

# turn ids into names

# refs = HTTParty.get("http://quidapi.herokuapp.com/people").parsed_response

# names = {}

# refs.each do |r|
#   names[r['_id']] = r['name']
# end

# pp names

# flipped = []

# @hrs.each do |h|
#   flipped << names[h]
# end

# pp flipped