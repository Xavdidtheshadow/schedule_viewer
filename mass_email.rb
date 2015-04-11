require 'gmail'
require 'pp'
require 'httparty'

people = HTTParty.get("http://quidapi.herokuapp.com/people").parsed_response

puts 'got response'

people.each do |pers|
  puts 'started'
  body_text = "Hey there, #{pers['name']}!<br><br>"
  body_text += "If we haven't met, I'm David, and I'm the assistant referee coordinator for World Cup 8. We're super excited to see you all this weekend!<br><br>We've got an awesome (I may be biased) schedule site (quidditchworldcup.herokuapp.com) that is your one stop shop for where you should be at all times. Each team, pitch, volunteer, and crew has a personalized schedule page (that you're HIGHLY encouraged to bookmark on your phone)."

  body_text += "Your personal volunteer page is here: http://quidditchworldcup.herokuapp.com/people/#{pers['_id']} and will update with the most accurate new information throughout the weekend.<br><br>"

  body_text += "Additionally, your team's page is here: http://quidditchworldcup.herokuapp.com/team/#{pers['team']['_id']} and shows when your team needs to staff games (that is, provide a pair of competent goal referees.<br><br>" unless pers['team']['name'] == 'NPR'

  body_text += "That website can be trusted to have the most up to date information as the weekend progresses since it's coming straight from us, your referee coordinators.<br><br>If you've got any questions, feel free to respond to this email, contact me on facebook, or find me in person this weekend.<br><br>You as volunteers are really the heroes here and without you, this event would just be a bunch of sweaty people hitting each other. For that, I thank you.<br><br>Now, let's have a kickass weekend!<br><br>~David Brownman<br>Assistant Referee Coordinator<br>IDRP Tech Director<br><br>"
  puts 'ready for gmail'
  Gmail.new(ENV['EMAIL'], ENV['EMAIL_PASSWORD']) do |gm|
    s = gm.deliver do 
      to pers['email']
      # to 'david@relateiq.com'
      # from 'David Brownman <beamneocube@gmail.com>'
      subject 'Gameplay Volunteer Information'
      html_part do
        body body_text
      end
    end
    # pp s
  end
  puts "finished #{pers['name']}"
  # exit
end