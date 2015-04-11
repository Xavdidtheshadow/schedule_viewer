require 'httparty'
require "pp"
require_relative 'wc_hrs'
require_relative 'wc_snitches'

# adds HR and SNITCH to each game

url = 'https://quidapi.herokuapp.com'
# url = 'http://localhost:1337'

# use after to do this later
games = HTTParty.get("#{url}/games").parsed_response
people = HTTParty.get("#{url}/people").parsed_response

names = {}

people.each do |r|
  names[r['name']] = r['_id']
end

games.each_with_index do |g, i|
  # puts g
  payload = {id: g['_id'], hr: names[@hrs[i]]}
  r = HTTParty.put("#{url}/games/hr", body: payload, query: ENV['QUID_API_KEY'])

  puts @snitches[i] unless names[@snitches[i]]
  payload = {id: g['_id'], snitch: names[@snitches[i]]}
  pp payload
  r = HTTParty.put("#{url}/games/snitch", body: payload, query: ENV['QUID_API_KEY'])
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