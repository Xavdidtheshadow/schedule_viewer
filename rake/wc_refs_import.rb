require 'json'
require 'httparty'
require 'pp'
require 'csv'
require 'bson'

# creates refs


url = 'https://quidapi.herokuapp.com'
# url = 'http://localhost:1337'


teams_dump = HTTParty.get("#{url}/teams").parsed_response

teams = {}
teams_dump.each do |t|
  teams[t['name']] = t['_id']
end

# pp teams
# exit

refs_file = CSV.open('ref_info_master.csv')
# burn the headers
refs_file.readline

refs_file.each do |line|
  # don't put in crewless refs for now
  # next unless line[6]
  # puts 'readline'
  if line[6] && line[6][2] == 'a'
    crews = [line[6], "B#{line[6][1..2]}"]
  else
    crews = [line[6]]
  end
  cert = {}
  begin 
    cert = {
      ar: line[9]["Ass"] ? true : false,
      sr: line[9]["Snitch Referee"] ? true : false,
      hr: line[9]["Head"] ? true : false
    }
  rescue
    cert = {ar: true, sr: true}
  end
  if not teams.include? line[5]
    puts line
    exit
  end
  ref = {
    name: "#{line[0]} #{line[1]}",
    email: line[2],
    phone: line[3] ? line[3].tr('- .()','') : nil,
    certifications: cert,
    crews: crews,
    team: teams[line[5]],
  }
  # puts 'requesting'
  r = HTTParty.post("#{url}/people", body: ref, query: {api_key: ENV['QUID_API_KEY']})
  puts r.parsed_response

end