# encoding: utf-8

# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "trusty"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

  config.vm.hostname = "bulb-bot"
  config.ssh.forward_agent = true

  config.vm.network :forwarded_port, guest: 3000, host: 3005
  #config.vm.network "private_network", ip: "192.168.1.128"

  config.vm.synced_folder "data", "/vagrant_data"

  config.vm.provider "virtualbox" do |vb|
     vb.gui = false
     vb.memory = "512"
  end

  config.vm.provision "shell", path: "bootstrap.sh"
  
end
