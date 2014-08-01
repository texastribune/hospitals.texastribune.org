# Hospital Explorer (webapp)

## Requirements

To run this app you will need on your computer:

* Ruby 2.1.2
* Node.js
* Bower

I recommend: [rbenv](https://github.com/sstephenson/rbenv) and [nvm](https://github.com/creationix/nvm).

## Building

  bundle install
  bower install
  middleman server

##  Deploying

  middleman build

**Note:** There is a branch called `s3-sync` with S3 oriented deploy.
