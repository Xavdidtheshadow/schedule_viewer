require 'pry'

require 'httparty'
require 'pp'

url = 'https://quidapi.herokuapp.com'
# url = 'http://localhost:1337'

# plul after
last_round = 3

games = HTTParty.get("#{url}/games", query: {after: last_round-2}).parsed_response
# binding.pry
crews = HTTParty.get("#{url}/crews").parsed_response.reject{|x| ['SNITCH', 'SRUN?'].include? x['_id']}
crew_flip = {}
crews.each{|c| crew_flip[c['_id']] = c}

no_no_teams = []

# DO SOMETHING WITH THIS
games[-10..-1].each do |g|
  # these teams shouldn't 
  g['crews'].each{|c| no_no_teams << crew_flip[c]['team']['name'] if crew_flip.include? c}
end

pp no_no_teams

# goggles?
better_times = [[],[]]

games.each do |g|
  # earlier timeslot
  if g['timeslot'] == last_round - 1
    # puts g['timeslot'], g['team_a']['name'], g['team_b']['name']
    cz = crews.select{|c| [g['team_a']['_id'], g['team_b']['_id']].include? c['team']['_id']}
    # pp cz
    better_times.first << cz
  else
    # puts g['timeslot'], g['team_a']['name'], g['team_b']['name']
    cz = crews.select{|c| [g['team_a']['_id'], g['team_b']['_id']].include? c['team']['_id']}
    # pp cz
    better_times.last << cz
  end
end

better_times.map!{|t| t.flatten.sort_by{|x| x['_id']}}

better_times.each do |timeslot|
  puts "TIMESLOT\n"
  pitches = timeslot.group_by{|x| x['_id'][/\d+/]}
  pitches.each do |p, cs|
    puts "\nPitch #{p}\nCrews: #{cs.map{|x| x['_id'][-1]}.join}"
  end
end