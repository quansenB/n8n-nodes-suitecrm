# If you have n8n installed: Install custom nodes module

Install it to the n8n root folder. This is the node_modules folder on the same level of n8n and n8n-core. This differs when you used the -g flag on n8n initial installation. From there do:

npm install n8n-nodes-dnc-suitecrm

# Fresh install n8n

Navigate to desired folder, create a package json and install n8n like so:

cd /var/www/vhosts/

mkdir my-n8n && cd my-n8n

npm init --yes

npm install n8n

# Start n8n

Directly:

n8n

Plesk or C-Panel:

node /var/www/vhosts/n8n/bin/n8n

# Latest functionality

SuiteCRM endpoints include Contacts, Accounts, Leads, Targets, Opportunities and any custom modules you might use.

# n8n-nodes-nordic-nodes

Nodes by digital-north-consulting.com. Contact us for consulting on this [node](mailto:info@digital-north-consulting.com).

Programmed with :heart: by [quansenB](https://github.com/quansenB)
