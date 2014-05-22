$LOAD_PATH.unshift(File.join(File.dirname(__FILE__), 'lib'))

require 'jsonificator'

activate :bower
activate :bourbon
activate :livereload
activate :jsonificator do |j|
  j.jsonificator_template = 'hospital.html'
end

set :css_dir, 'css'
set :js_dir, 'js'
set :images_dir, 'img'
