module.exports = function(server) {
    
    return {
        generate_job_title: function() {
            var prefix = server.assets.job_titles_prefix[Math.floor(Math.random() * server.assets.job_titles_prefix.length)];
            var suffix = server.assets.job_titles_suffix[Math.floor(Math.random() * server.assets.job_titles_suffix.length)];
            return prefix + ' ' + suffix.trim();
        },
        generate_antoa: function(data) {
            var r = data.numRecommenders || 1;
            return Math.round(Math.sqrt(data.numConnections * r)*Math.pow(10,2));
        },
        random_bio: function(type) {
            return server.assets['bios_' + type][Math.floor(Math.random() * server.assets['bios_' + type].length)].trim();
        }            
    };
};