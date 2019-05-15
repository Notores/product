function stringToUrl(title) {
    title = str2slug(title);

    return title.toLowerCase()
        .replace(/\//g, '')
        .replace(/ /g, '-')
        .replace(/_+/g, '-');
}

function str2slug(str) {
    const rep = '-';

    str = str.toLowerCase()
        .replace(/\s+/g, rep); // replace whitespace

    // remove accents, swap ñ for n, etc
    const from = 'àáäâèéëêìíïîòóöôùúüûñçß';
    const to = 'aaaaeeeeiiiioooouuuuncs';
    for (let i = 0, l = from.length; i < l; i++) {
        str = str.replace(
            new RegExp(from.charAt(i), 'g'),
            to.charAt(i)
        );
    }
    // remove invalid chars
    str = str.replace(new RegExp(`[^a-z0-9${rep}.]`, 'g'), '')
        .replace(/-+/g, rep); // collapse dashes;

    return str;
}

module.exports = {
    stringToUrl
};
