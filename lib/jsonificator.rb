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
      if json_file =~ /\d+\.json/
        json_data = JSON.parse(File.open(json_file).read)
        page_name = json_data["name"].parameterize
        data = json_data["data"]
        app.proxy(
          "#{page_name}.html",
          "#{options.jsonificator_template}",
          locals: {
            id: json_data["_id"],
            url: json_data["url"],
            name: json_data["name"],
            address: json_data["address"],
            city: json_data["city"],
            zipcode: json_data["zipcode"],
            type: json_data['type'],
            latitude: json_data['latitude'],
            longitude: json_data['longitude'],
            hospital_ownership: json_data['hospital ownership'],
            emergency_services: json_data['emergency_services'],
            op_18: data['emergency_rates']["OP 18"],
            ed1: data['emergency_rates']["ED1"],
            door_to_diagnostic: data['emergency_rates']["Door to diagnostic eval"],
            serious_complications: data['complications_rates']['serious_complications'],
            death_from_serious_complications: data['complications_rates']['death_from_serious_complications'],
            rr_from_pn: data['readmission_rates']["rr_from_pn"],
            rr_from_ha: data['readmission_rates']["rr_from_ha"],
            rr_from_k_or_n: data['readmission_rates']["rr_from_k_or_n"],
            rr_from_hf: data['readmission_rates']["rr_from_hf"],
            mort_30_pn_performance_rate: data["death_rates"]["mort_30_pn_performance_rate"],
            mort_30_ami_performance_rate: data["death_rates"]["mort_30_ami_performance_rate"],
            mort_30_hf_performance_rate: data["death_rates"]["mort_30_hf_performance_rate"],
            always_quiet_at_night: data["quality"]["always_quiet_at_night"],
            rating_9_or_10: data["quality"]["rating_9_or_10"],
            doctors_always_communicate_well: data["quality"]["doctors_always_communicate_well"],
            nurses_always_communicate_well: data["quality"]["nurses_always_communicate_well"],
            always_received_help: data["quality"]["always_received_help"]
          })
      end
    end
  end

  helpers do
    def make_a_link(url, text)
      "<a href='#{url}'>#{text}</a>"
    end
  end
end

::Middleman::Extensions.register(:jsonificator, Jsonificator)