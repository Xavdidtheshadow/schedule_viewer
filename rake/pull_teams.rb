# we pull the last round of refs and don't shedule their games first
# print teams that reffed the last round

require 'pry'

require 'httparty'
require 'pp'

url = 'https://quidapi.herokuapp.com'
# url = 'http://localhost:1337'

# plul after
last_round = 3

games = HTTParty.get("#{url}/games", query: {after: last_round-1}).parsed_response
# binding.pry
 = HTTParty.get("#{url}/crews").parsed_response.reject{|x| ['NPR', 'SNITCH', 'SRUN?'].include? x['_id']}

no_no_teams = []

games.each do |g|
  no_no_teams << [g['team_a'], g['team_b']]
end

no_no_teams.flatten!
puts no_no_teams
exit

better_times.map!{|t| t.flatten.sort_by{|x| x['_id']}}

better_times.each do |timeslot|
  puts "TIMESLOT\n"
  pitches = timeslot.group_by{|x| x['_id'][/\d+/]}
  pitches.each do |p, cs|
    puts "\nPitch #{p}\nCrews: #{cs.map{|x| x['_id'][-1]}.join}"
  end
end