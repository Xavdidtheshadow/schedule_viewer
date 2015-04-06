require 'httparty'
require_relative 'wc_hrs'

games = HTTParty.get("http://quidapi.herokuapp.com/games").parsed_response

games.each_with_index do |g, i|
  # puts g
  payload = {id: g['_id'], hr: @hrs[i]}
  r = HTTParty.put("http://quidapi.herokuapp.com/games/hr", body: payload, query: ENV['QUID_API_KEY'])
  puts r
end