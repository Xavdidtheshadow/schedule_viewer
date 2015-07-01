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
url = 'http://localhost:1337'

require_relative 'wc_grs'

ids = {}
build = false
# fetch or build teams

people = HTTParty.get("#{url}/people").parsed_response

names = {}
tn = {}

people.each do |r|
  names[r['name']] = r['_id']
end

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
    # tn[t['name']] = "#{t['flight']}.#{t['rank']}"
  end
end

# pp @grs.map{|i| i.map{|j| tn[j]}}
# exit

puts "game time!"

games_file = File.open('wc_games.txt')
pc = 0
games_file.each do |g|
  info = g.split('|').first
  flight = info.split('f').first
  time = info.split('f').last.to_i

  teams = g.split('|')[1].chomp.split('v')
  hr = g.split('|')[2].chomp
  sni = g.split('|')[3].chomp
  c = g.split('|').last.chomp.split('')

  payload = {
    timeslot: time, pitch: pc % 10, 
    team_a: ids["#{flight}.#{teams.first}"], 
    team_b: ids["#{flight}.#{teams.last}"], 
    crews: make_crews(flight, pc, c),
    staff: ids[@staff[time][pc % 10]],
    head_referee: names[hr],
    snitch: names[sni]
  }
  # exit
  # USE TO_JSON AND USE APPLICATION/JSON
  r = HTTParty.post("#{url}/games", body: payload.to_json, query: {api_key: ENV['QUID_API_KEY']}, headers: {"Content-Type"=>"application/json"})

  pp r
  pc += 1
end