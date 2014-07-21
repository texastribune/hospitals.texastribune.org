require 'builder'

$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'lib'))

require 'jsonificator'
require 'active_support/all'

activate :bower
activate :bourbon
activate :livereload
activate :jsonificator do |j|
  j.jsonificator_template = 'hospital.html'
end
activate :deploy do |deploy|
  deploy.method = :rsync
  deploy.host   = "codingnews.info"
  deploy.path   = "/home/malev/apps/hospital.codingnews.info"
  deploy.user   = "malev"
  deploy.build_before = true
end
activate :directory_indexes

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'

page "/sitemap.xml", :layout => false
page "/sitemap.html", :layout => false, directory_index: false
page "/404.html", directory_index: false

configure :build do
  activate :minify_css
  activate :minify_javascript
end

helpers do
  def format_time(var)
    if var
      "#{var} min."
    else
      'N/A'
    end
  end

  def format_str(str)
    if str.blank?
      'N/A'
    else
      str
    end
  end

  def format_percentage(num)
    if num
      "#{num}%"
    else
      "N/A"
    end
  end

  def bool_to_str(bool)
    if bool.nil?
      'N/A'
    elsif bool == false or bool.downcase == "false"
      "No"
    else
      "Yes"
    end
  end
end