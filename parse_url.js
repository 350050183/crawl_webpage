function parse_url(url){
        var token = '';
        var ret = new Array();
        var arg = new Array();
        var query = '';

        if(url.length <= 0) return false;

        var full_url_path =  url.substr( 0, url.indexOf('?') <= 0 ? url.length : url.indexOf('?') );
        ret['url'] = full_url_path;

        if( url.indexOf('?') > 0 )
        {
            query = url.substr( url.indexOf('?') + 1 );
        }
        ret['query'] = query;
        ret['path'] = full_url_path.substr( 0, url.lastIndexOf('/') + 1 );

        if( ret['path'].match( /^http.*\.[a-z]{2,4}/g ) )
        {
            var tmp = ret['path'].substr( ret['path'].indexOf('://') + 3 );
            ret['domain'] = tmp.substr( 0, tmp.indexOf('/') );
        }

        var query_string = url.substr( url.indexOf('?')+1 );
        if( query_string.indexOf('&') > 0 )
        {
            arg = query_string.split('&');
        }
        else
        {
            arg[0] = query_string;
        }

        for(var i=0; i<arg.length; i++)
        {
            if( arg[i].indexOf('=') >= 0 )
            {
                token = arg[i].split('=');
                ret[token[0]] = token[1];
            }
            else
            {
                ret[token[0]] = '';
            }
        }
        return ret;
    }