const $help = $('.help-text--wrapper');
const $container = $('.container');
const parseInput = (input) => {
  return input.split(' ');
}

$('.close').on('click', () => {
  $help.hide();
  $container.removeClass('helping');
});

$('.help').on('click', () => {
  $help.show();
  $container.addClass('helping');
});

let nicknames = {};
let filenames;

$.get('data/nickname.json?_v=6')
  .done(data => {
    for (let key of Object.keys(data)) {
      const arr = data[key];
      for (let name of arr) {
        nicknames[name] = key;
      }
    }
  });

$.get('data/filename.json?_v=11')
  .done(data => {
    filenames = data;
    $.get('data/data.json?_v=3')
      .done(stats => {
        const $input = $('#main');
        $input.bind('change keyup input', () => {
          const result = parseInput($input.val().trim());
          let index = 0;
          let redTotal = 0;
          let blueTotal = 0;
          for (text of result) {
            index ++;
            const key = nicknames[text];
            const stat = stats[key];
            const filename = filenames[key];
            if (stat) {
              const win = stat.winning;
              const lose = stat.losing;
              const sum = win + lose;

              const result = `${win}/${lose}`;
              let winp = parseInt((win / sum) * 100) + '%';
              let score = 7.395 * win / sum + 3.385 * sum / 3200;
              if (sum === 0) {
                winp = '0%';
                // hardcoded average score
                score = 3.71;
              }
              
              const $target = $(`.result-${index}`);
              const avatar = `resources/pixyys/${filename}.png`;
              const placeholder = 'resources/pixyys/yxdm.png'
              $target.find('.name').text(key);
              $.ajax({
                url: avatar
              }).done(function(data, txt, xhr) {
                if (xhr.status === 200) {
                  $target.find('.avatar').css('background-image', `url('${avatar}')`);
                } else {
                  $target.find('.avatar').css('background-image', `url(${placeholder})`);
                }
              }).fail(function() {
                $target.find('.avatar').css('background-image', `url(${placeholder})`);
              });
              $target.find('.win-lose').text(result);
              $target.find('.win-percentage').text(winp);
              $target.find('.score').text(parseInt(score * 100) / 100);
              if (index <= 5) {
                redTotal += score;
              } else {
                blueTotal += score;
              }
            }
          }
          $('.result-wrapper--red .overview').text(parseInt(redTotal / 5 * 100) / 100);
          $('.result-wrapper--blue .overview').text(parseInt(blueTotal / 5 * 100) / 100);
        });
      });
  });
