class S3Gzip < Middleman::Extension
  option :exts, %W(.js .css .html .htm), 'Extensions to suppres and replace by gzipped version'
  def initialize(app, options_hash={}, &block)
    super
    this = self
    app.after_build do |builder|
      this.remove_plain_files
      this.rename_gz_files
    end
  end

  def remove_plain_files
    build_files.each do |filename|
      if valid_extension?(filename)
        puts "        \e[91mRemove\e[39m " + filename
        remove(filename)
      end
    end
  end

  def rename_gz_files
    build_files.each do |filename|
      if gz?(filename)
        puts "        \e[92mRename\e[39m " + new_filename(filename)
        rename(filename)
      end
    end
  end

  def build_files
    Dir.glob("#{app.build_dir}/**/**")
  end

  def gz?(filename)
    /gz$/ =~ filename && File.file?(filename)
  end

  def valid_extension?(filename)
    options.exts.each do |ext|
      return true if regexp(ext) =~ filename && File.file?(filename)
    end
    return false
  end

  def regexp(extension)
    Regexp.new("\\" + extension + "$")
  end

  def remove(filename)
    FileUtils.rm(filename)
  end

  def rename(filename)
    FileUtils.move filename, new_filename(filename)
  end

  def new_filename(filename)
    File.join(
      File.dirname(filename),
      File.basename(filename, ".gz")
    )
  end
end

::Middleman::Extensions.register(:s3gzip, S3Gzip)
