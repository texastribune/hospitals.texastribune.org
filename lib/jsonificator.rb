require 'json'
require 'active_support/all'

class Jsonificator < Middleman::Extension
  option :json_dir, 'data', 'Where are the json files'
  option :jsonificator_template, 'jsonificator', 'Template file'

  def initialize(app, options_hash={}, &block)
    super
  end

  def after_configuration
    Dir["#{options.json_dir}/*.json"].each do |json_file|
      json_data = JSON.parse(File.open(json_file).read)
      page_name = json_data["name"].parameterize
      app.proxy "#{page_name}.html", "#{options.jsonificator_template}"
    end
  end

  helpers do
    def make_a_link(url, text)
      "<a href='#{url}'>#{text}</a>"
    end
  end
end

::Middleman::Extensions.register(:jsonificator, Jsonificator)