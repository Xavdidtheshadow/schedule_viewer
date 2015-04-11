require 'json'
require 'httparty'
require 'pp'

# creates teams and games

def make_crews(f, pc, crews)
  flight = f == '1' ? 'A' : 'B'
  pitch = (pc % 10) + 1
  crews.map{|c| "#{flight}#{pitch}#{c}"}
end

url = 'https://quidapi.herokuapp.com'
# url = 'http://localhost:1337'

require_relative 'wc_grs'

ids = {}
build = true
# fetch or build teams

if build
  # BUILD
  teams_file = File.open('wc_teams.txt')
  teams_file.each do |t|
    info = t.split('|').first.split('.')
    name = t.split('|').last.chomp
    payload = {name: name, flight: info.first, rank: info.last}
    r = HTTParty.post("#{url}/teams", body: payload, query: {api_key: ENV['QUID_API_KEY']})

    # this crashes the api?!
    # r = HTTParty.post("#{url}/teams", query: payload, query: {api_key: 'qD8jnrWPc'})
    ids["#{info.first}.#{info.last}"] = r['message']
  end
  payload = {name: 'NPR', flight: '3', rank: '0'}
  r = HTTParty.post("#{url}/teams", body: payload, query: {api_key: ENV['QUID_API_KEY']})
  ids["3.0"] = r['message']
else
  # FETCH
  teams_dump = HTTParty.get("#{url}/teams").parsed_response
  teams_dump.each do |t|
    ids["#{t['flight']}.#{t['rank']}"] = t['_id']
  end
end


puts "game time!"

games_file = File.open('wc_games.txt')
pc = 0
games_file.each do |g|
  info = g.split('|').first
  flight = info.split('f').first
  time = info.split('f').last.to_i

  teams = g.split('|')[1].chomp.split('v')
  c = g.split('|').last.chomp.split('')

  payload = {
    timeslot: time, 
    pitch: pc % 10, 
    team_a: ids["#{flight}.#{teams.first}"], 
    team_b: ids["#{flight}.#{teams.last}"], 
    crews: make_crews(flight, pc, c),
    staff: ids[@staff[time][pc % 10]]
  }

  r = HTTParty.post("#{url}/games", body: payload, query: {api_key: ENV['QUID_API_KEY']})
  pp r
  pc += 1
end