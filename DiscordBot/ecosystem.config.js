module.exports = {
  /**
   * Application configuration section
   */
  apps : [

    // Applications to start
    {
      name      : 'Artemis A.I. Discord Bot',
      script    : 'AA.js',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },
	{
		name: 'Web Server / OAuth Endpoints',
		script: 'webserver.js'
	},
	{
		name: 'Cluster Slave Discord Bot',
		script: 'AAC.js'
	}
  ],

  /**
   * Deployment section
   * 
   */
  deploy : {
    production : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/production',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production'
    },
    dev : {
      user : 'node',
      host : '212.83.163.1',
      ref  : 'origin/master',
      repo : 'git@github.com:repo.git',
      path : '/var/www/development',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env dev',
      env  : {
        NODE_ENV: 'dev'
      }
    }
  }
};
