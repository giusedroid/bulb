# encoding: utf-8

# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|

  config.vm.box = "trusty"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

  config.vm.hostname = "bulb-bot"
  config.ssh.forward_agent = true

  config.vm.network :forwarded_port, guest: 3000, host: 3005
  config.vm.network "private_network", ip: "192.168.56.128"
  
  # if vagrant complains about The specified host network collides with a non-hostonly network!
  # check your VirtualBox DHCP preferences
  # Open VirtualBox, Go to Preferences > Network. 
  # Open the "Host-only Networks" and double click on the correct entry (mine is called vboxnet0).
  # Open the DHCP Server tab and look for the "Lower Address Bound" and "Upper Address Bound".
  # In my case it's 192.168.56.101 and 192.168.56.254.
  # Change the ip param in config.vm.network to an ip in that range :)


  config.vm.synced_folder "data", "/vagrant_data"

  config.vm.provider "virtualbox" do |vb|
     vb.gui = false
     vb.memory = "512"
  end

  config.vm.provision "shell", path: "bootstrap.sh"
  config.vm.provision "shell", path: "startup.sh", privileged: false
  
end
