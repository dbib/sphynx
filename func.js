function checkAndAdd(elt, songsRange) {
    for(const item of songsRange) {
        if (elt.artist == item.artist) {
            for(const alb of item.albums) {
                if (elt.album == alb.albumTitle) {
                    alb.songs.push(elt.song)
                    console.log(`song: ${elt.song} added in ${alb.albumTitle}`)
                    return `new song added`;
                }
            }
            item.albums.push({
                albumTitle: elt.album,
                songs: [elt.song]
            });
            console.log(`new album added`);
            return `new album added`
        }
    }

    songsRange.push({
        artist: elt.artist,
        albums: [
            {
                albumTitle: elt.album,
                songs: [elt.song]
            }
        ]
    })
    console.log('new artist and album added');
    return 'new added';
}

const filemodel = {
    artist: '',
    albums: [
        {
            albumTitle: '',
            albumCover: '',
            songs : []
        }
    ]
}

module.exports