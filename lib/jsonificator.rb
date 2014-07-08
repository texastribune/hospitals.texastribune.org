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
            phone_number: json_data["phone_number"],
            address: json_data["address"],
            city: json_data["city"],
            zipcode: json_data["zipcode"],
            type: json_data['type'],
            latitude: json_data['latitude'],
            longitude: json_data['longitude'],
            hospital_ownership: json_data['hospital ownership'],
            emergency_services: json_data['emergency_services'],
            op_18b: data['emergency_rates']["op_18b"],
            ed_1b: data['emergency_rates']["ed_1b"],
            op_20: data['emergency_rates']["op_20"],
            serious_complications: data['complications_rates']['serious_complications'],
            death_from_serious_complications: data['complications_rates']['death_from_serious_complications'],
            readm_30_pn: data['readmission_rates']["readm_30_pn"],
            readm_30_ha: data['readmission_rates']["readm_30_ha"],
            readm_30_hip_knee: data['readmission_rates']["readm_30_hip_knee"],
            readm_30_hf: data['readmission_rates']["readm_30_hf"],
            mort_30_pn_performance_rate: data["death_rates"]["mort_30_pn_performance_rate"],
            mort_30_ami_performance_rate: data["death_rates"]["mort_30_ami_performance_rate"],
            mort_30_hf_performance_rate: data["death_rates"]["mort_30_hf_performance_rate"],
            h_quiet_hsp_a_p: data["quality"]["h_quiet_hsp_a_p"],
            h_hsp_rating_9_10: data["quality"]["h_hsp_rating_9_10"],
            h_comp_2_a_p: data["quality"]["h_comp_2_a_p"],
            h_comp_1_a_p: data["quality"]["h_comp_1_a_p"],
            h_comp_3_a_p: data["quality"]["h_comp_3_a_p"],
            h_clean_hsp_a_p: data["quality"]["h_clean_hsp_a_p"],
            h_recmnd_dy: data["quality"]["h_recmnd_dy"],
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