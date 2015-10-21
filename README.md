# Hospital Explorer (webapp)

## Requirements

To run this app you will need on your computer:

* Ruby 2.1.5
* Node.js
* Bower
* bundler

I recommend: [rbenv](https://github.com/sstephenson/rbenv) and [nvm](https://github.com/creationix/nvm).

When you get errors about which Ruby version you're using, run `rbenv install 2.1.5`.

## Building

    bundle install
    bower install
    bundle exec middleman server
    
Don't forget to run `rbenv rehash` after installing gems to enable the binaries. Only if you are using `rbenv`.

##  Before deploying

    middleman build
    middleman s3_sync

Keep in mind that you will need to change `BUCKET` y `config.rb` to point the deploy to your bucket. Also you will need to have `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` defined as environmental variables on your system. And if you want special configurations on your deploy, check first [this](https://github.com/fredjean/middleman-s3_sync).

## jshint

To check how is your JavaScript going, just run:

    rake jshint
