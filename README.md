# n8n-nodes-nordic-nodes
Nodes by digital-north-consulting.com. Contact us for consulting on this [node](mailto:info@digital-north-consulting.com)

# Installation
Install it to the node_modules folder on the same level of n8n and n8n-core.

# Install n8n
Navigate to desired folder, create a package json and install n8n like so:
cd /var/www/vhosts/
mkdir my-n8n && cd my-n8n
npm init --yes
npm install n8n

# Install custom nodes module
Navigate to n8n root folder with the package.json, install custom nodes:
cd /var/www/vhosts/my-n8n
npm install n8n-nodes-my-custom-nodes 

# Start n8n
Directly:
n8n

Plesk or C-Panel:
node /var/www/vhosts/n8n/bin/n8n

# Latest functionality
SuiteCRM endpoints include Contacts, Accounts, Leads, Targets, Opportunities and any Custom Modules you might use.
