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
      if json_file =~ /\d+\w?\.json/
        hospital_data = JSON.parse(File.open(json_file).read)
        indicators = hospital_data["indicators"]
        page_name = hospital_data["name"].parameterize

        app.proxy(
          "#{page_name}.html",
          "#{options.jsonificator_template}",
          locals: build_locals(hospital_data, indicators)
        )
      end
    end

    Dir["#{options.json_dir}/05-2014/*.json"].each do |json_file|
      if json_file =~ /\d+\w?\.json/
        hospital_data = JSON.parse(File.open(json_file).read)
        indicators = hospital_data["indicators"]
        page_name = hospital_data["name"].parameterize

        app.proxy(
          "2012/#{page_name}.html",
          "#{options.jsonificator_template}",
          locals: build_locals(hospital_data, indicators, false)
        )
      end
    end
  end

  def build_locals(hospital_data, indicators, current=true)
    {
      id: hospital_data["_id"],
      url: "/" + hospital_data["url"],
      name: hospital_data["name"],
      phone_number: hospital_data["phone_number"],
      address: hospital_data["address"],
      city: hospital_data["city"],
      zipcode: hospital_data["zipcode"],
      type: hospital_data['type'],
      latitude: hospital_data['latitude'],
      longitude: hospital_data['longitude'],
      hospital_ownership: hospital_data['hospital ownership'],
      emergency_services: hospital_data['emergency_services'],

      op_18b: indicators["op_18b"],
      ed_1b: indicators["ed_1b"],
      op_20: indicators["op_20"],

      serious_complications: indicators['serious_complications'],
      death_from_serious_complications: indicators['death_from_serious_complications'],

      readm_30_pn: indicators["readm_30_pn"],
      readm_30_ha: indicators["readm_30_ha"],
      readm_30_hip_knee: indicators["readm_30_hip_knee"],
      readm_30_hf: indicators["readm_30_hf"],
      readm_30_hosp_wide: indicators['readm_30_hosp_wide'],
      mort_30_pn: indicators["mort_30_pn"],
      mort_30_hf: indicators["mort_30_hf"],
      mort_30_ami: indicators["mort_30_ami"],
      mort_30_ha: indicators['mort_30_ha'],
      comp_hip_knee: indicators["comp_hip_knee"],

      h_quiet_hsp_a_p: indicators["h_quiet_hsp_a_p"],
      h_hsp_rating_9_10: indicators["h_hsp_rating_9_10"],
      h_comp_2_a_p: indicators["h_comp_2_a_p"],
      h_comp_1_a_p: indicators["h_comp_1_a_p"],
      h_comp_3_a_p: indicators["h_comp_3_a_p"],
      h_clean_hsp_a_p: indicators["h_clean_hsp_a_p"],
      h_recmnd_dy: indicators["h_recmnd_dy"],

      hai_1_desc: indicators['hai_1_desc'],
      hai_2_desc: indicators['hai_2_desc'],
      hai_3_desc: indicators['hai_3_desc'],
      hai_4_desc: indicators['hai_4_desc'],
      hai_1: indicators['hai_1'],
      hai_2: indicators['hai_2'],
      hai_3: indicators['hai_3'],
      hai_4: indicators['hai_4'],

      # old-url
      old_url: old_link(hospital_data),

      # header-title
      title: hospital_data["name"] + " | Texas Hospital Explorer | The Texas Tribune",
      # OG
      og_site_name: hospital_data["name"] + " | Texas Hospital Explorer | The Texas Tribune",
      og_url: "http://hospitals.texastribune.org/" + hospital_data["url"],
      current: current
    }
  end

  def old_link(hospital_data)
    if hospital_data["old_url"]
      "/2012/" + hospital_data["old_url"]
    else
      nil
    end
  end

  helpers do
    def make_a_link(url, text)
      "<a href='#{url}'>#{text}</a>"
    end
  end
end

::Middleman::Extensions.register(:jsonificator, Jsonificator)
