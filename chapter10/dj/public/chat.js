function $(id) { return this.document.getElementById(id) }

window.onload = function () {
    var socket = io.connect();
    socket.on('connect', function () {
        socket.emit('join', prompt('What is your nickname?'));
        document.getElementById('chat').style.display = 'block';
    });
    socket.on('announcement', function (msg) {
        var li = document.createElement('li');
        li.className = 'announcement';
        li.innerHTML = msg;
        document.getElementById('messages').appendChild(li);
    });

    function addMessage (from, text) {
        var li = document.createElement('li');
        li.className = 'message';
        li.innerHTML = '<b>' + from + '</b>: ' + text;
        document.getElementById('messages').appendChild(li);
        return li;
    }

    var input = this.document.getElementById('input');
    document.getElementById('form').onsubmit = function () {
        var li = addMessage('me', input.value);
        socket.emit('text', input.value, function (date) {
            li.className = 'confirmed';
            li.title = date;
        });
        input.value = '';
        input.focus();
        return false;
    }

    socket.on('text', addMessage);

    // Search from
    var form = $('dj')
        , results = $('results');
    form.onsubmit = function () {
        results.innerHTML = '';
/*         socket.emit('search', $('s').value, function (songs) {
            for (var i = 0, l = songs.length; i < l; i++) {
                (function (song) {
                    var result = document.createElement('li');
                    result.innerHTML = song.ArtistName + '-' + song.SongName;
                    var a = document.createElement('a');
                    a.href = '#';
                    a.innerHTML = 'select';
                    a.onclick = function () {
                        socket.emit('song', song);
                        play(song);
                        return false;
                    }
                    result.appendChild(a);
                    results.appendChild(result);
                })(songs[i]);
            }
        }); */
        socket.emit('search', $('s').value, function (songs) {
            for (var i = 0, l = songs.total_count; i < l; i++) {
                (function (song) {
                    var result = document.createElement('li');
                    result.innerHTML = song.name + '-' + song.full_name;
                    var a = document.createElement('a');
                    a.href = '#';
                    a.innerHTML = 'select';
                    a.onclick = function () {
                        socket.emit('song', song);
                        play(song);
                        return false;
                    }
                    result.appendChild(a);
                    results.appendChild(result);
                })(songs.items[i]);
            }
        });
        return false;
    }

    socket.on('elected', function () {
        form.className = 'isDJ';
    });


    //Playing the song
    var playing = $('playing');
/*     function play(song) {
        if (!song) return;
        playing.innerHTML = '<hr><b>Now Playing:</b> ' + song.ArtistName + ' ' + song.SongName + '</hr>'
        var iframe = document.createElement('iframe');
        iframe.frameborder = 0;
        iframe.src = song.Url;
        playing.appendChild(iframe);
    } */
    function play(song) {
        if (!song) return;
        playing.innerHTML = '<hr><b>Now Playing:</b> ' + song.name + ' ' + song.full_name + '</hr>'
        var iframe = document.createElement('iframe');
        iframe.frameborder = 0;
        iframe.src = song.html_url;
        playing.appendChild(iframe);
    }
    socket.on('song', play);
}