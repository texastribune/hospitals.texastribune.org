require 'builder'

$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'lib'))

require 's3_gzip'
require 'active_support/all'

ignore 'hospital.html'
activate :gzip, exts: %w(.js .css .html .htm .json .geojson)
activate :asset_hash
activate :bower
activate :bourbon
activate :livereload
activate :s3gzip, exts: %w(.js .css .html .htm .json .geojson)
activate :directory_indexes
activate :s3_sync do |s3_sync|
  s3_sync.bucket = 'BUCKET'
  s3_sync.region = 'us-west-1'
end

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'

page "/sitemap.xml", :layout => false
page "/sitemap.html", :layout => false, directory_index: false
page "/404.html", directory_index: false

configure :build do
  activate :minify_html
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
