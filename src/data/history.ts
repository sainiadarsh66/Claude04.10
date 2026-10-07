/**
 * Curated, family-friendly "on this day" content. Upsetting events are left out
 * on purpose; anything to do with war is tagged so it can be hidden for
 * residents who find it distressing.
 *
 * Format: [MM-DD, year or null, kind, text, tags?]
 */
export type HistoryKind = 'event' | 'birthday' | 'celebration';

type Row = [string, number | null, HistoryKind, string, string[]?];

const ROWS: Row[] = [
  ['01-01', null, 'celebration', "New Year's Day"],
  ['01-01', 1951, 'event', 'The Archers began on national BBC radio', ['radio']],
  ['01-01', 1964, 'event', 'The first "Top of the Pops" was shown on BBC television', ['tv', 'music']],
  ['01-03', 1892, 'birthday', 'J.R.R. Tolkien, author of "The Hobbit"', ['books']],
  ['01-06', null, 'celebration', 'Epiphany: traditionally the day the Christmas decorations come down'],
  ['01-08', 1935, 'birthday', 'Elvis Presley, the King of Rock and Roll', ['music']],
  ['01-08', 1937, 'birthday', 'Shirley Bassey, singer from Cardiff', ['music']],
  ['01-09', 1898, 'birthday', 'Gracie Fields, singer and actress from Rochdale', ['music']],
  ['01-10', 1863, 'event', 'The London Underground opened, the first underground railway in the world', ['transport']],
  ['01-12', 1932, 'birthday', "Des O'Connor, singer and TV presenter", ['tv']],
  ['01-15', 1929, 'birthday', 'Martin Luther King Jr., civil rights leader'],
  ['01-17', 1942, 'birthday', 'Muhammad Ali, boxing champion', ['sport']],
  ['01-18', 1882, 'birthday', 'A.A. Milne, author of "Winnie-the-Pooh"', ['books']],
  ['01-18', 1904, 'birthday', 'Cary Grant, film star born in Bristol', ['film']],
  ['01-19', 1946, 'birthday', 'Dolly Parton, country singer', ['music']],
  ['01-21', 1924, 'birthday', 'Benny Hill, comedian', ['tv']],
  ['01-25', null, 'celebration', 'Burns Night: haggis, neeps and tatties in Scotland'],
  ['01-25', 1759, 'birthday', 'Robert Burns, Scottish poet who wrote "Auld Lang Syne"', ['books']],
  ['01-26', 1925, 'birthday', 'Paul Newman, film star', ['film']],
  ['01-27', 1756, 'birthday', 'Wolfgang Amadeus Mozart, composer', ['music']],
  ['01-27', 1832, 'birthday', 'Lewis Carroll, author of "Alice in Wonderland"', ['books']],
  ['02-01', 1901, 'birthday', 'Clark Gable, star of "Gone with the Wind"', ['film']],
  ['02-01', 1915, 'birthday', 'Stanley Matthews, footballer', ['sport']],
  ['02-03', 1927, 'birthday', 'Val Doonican, singer famous for his rocking chair', ['music', 'tv']],
  ['02-04', 1915, 'birthday', 'Norman Wisdom, comedian and actor', ['film']],
  ['02-07', 1812, 'birthday', 'Charles Dickens, author of "Oliver Twist"', ['books']],
  ['02-07', 1922, 'birthday', 'Hattie Jacques, actress in the "Carry On" films', ['film']],
  ['02-12', 1809, 'birthday', 'Charles Darwin, naturalist', ['nature']],
  ['02-14', null, 'celebration', "Valentine's Day"],
  ['02-15', 1971, 'event', 'Decimal Day: Britain changed to the new pounds and pence', ['money']],
  ['02-22', 1926, 'birthday', 'Kenneth Williams, "Carry On" actor', ['film']],
  ['02-22', 1928, 'birthday', 'Bruce Forsyth, entertainer: "Nice to see you, to see you nice!"', ['tv']],
  ['02-25', 1943, 'birthday', 'George Harrison of The Beatles', ['music']],
  ['02-26', 1928, 'birthday', 'Fats Domino, rock and roll pianist', ['music']],
  ['02-26', 1932, 'birthday', 'Johnny Cash, country singer', ['music']],
  ['02-27', 1932, 'birthday', 'Elizabeth Taylor, film star', ['film']],
  ['02-28', 1953, 'event', 'Scientists Francis Crick and James Watson announced they had found the structure of DNA', ['science']],
  ['03-01', null, 'celebration', "St David's Day, the patron saint of Wales"],
  ['03-01', 1904, 'birthday', 'Glenn Miller, big band leader', ['music']],
  ['03-02', 1969, 'event', 'Concorde made its first flight', ['transport']],
  ['03-04', 1923, 'birthday', 'Patrick Moore, astronomer and presenter of "The Sky at Night"', ['tv', 'science']],
  ['03-06', 1917, 'birthday', 'Frankie Howerd, comedian', ['tv']],
  ['03-07', 1876, 'event', 'Alexander Graham Bell was granted a patent for the telephone', ['science']],
  ['03-10', 1876, 'event', 'The first telephone call: "Mr Watson, come here, I want to see you"', ['science']],
  ['03-14', 1879, 'birthday', 'Albert Einstein, scientist', ['science']],
  ['03-14', 1933, 'birthday', 'Michael Caine, actor', ['film']],
  ['03-15', 1949, 'event', 'Clothes rationing ended in Britain', ['fashion']],
  ['03-15', 1961, 'event', 'The Jaguar E-Type sports car was launched', ['cars']],
  ['03-17', null, 'celebration', "St Patrick's Day, the patron saint of Ireland"],
  ['03-17', 1919, 'birthday', 'Nat King Cole, singer', ['music']],
  ['03-19', 1921, 'birthday', 'Tommy Cooper, comedian and magician: "Just like that!"', ['tv']],
  ['03-20', 1917, 'birthday', 'Vera Lynn, singer of "We\'ll Meet Again"', ['music']],
  ['03-22', 1963, 'event', 'The Beatles released their first album, "Please Please Me"', ['music']],
  ['03-24', 1930, 'birthday', 'Steve McQueen, film star', ['film']],
  ['03-25', 1942, 'birthday', 'Aretha Franklin, the Queen of Soul', ['music']],
  ['03-25', 1947, 'birthday', 'Elton John, singer and pianist', ['music']],
  ['03-26', 1944, 'birthday', 'Diana Ross, singer with The Supremes', ['music']],
  ['03-28', 1921, 'birthday', 'Dirk Bogarde, actor', ['film']],
  ['03-30', 1972, 'event', 'The Treasures of Tutankhamun exhibition opened at the British Museum', ['history']],
  ['03-31', 1889, 'event', 'The Eiffel Tower in Paris was opened', ['places']],
  ['04-01', null, 'celebration', "April Fools' Day"],
  ['04-01', 1957, 'event', 'The BBC showed a famous April Fool: spaghetti growing on trees in Switzerland', ['tv', 'food']],
  ['04-02', 1914, 'birthday', 'Alec Guinness, actor', ['film']],
  ['04-03', 1922, 'birthday', 'Doris Day, singer and actress: "Que Sera, Sera"', ['music', 'film']],
  ['04-05', 1908, 'birthday', 'Bette Davis, film star', ['film']],
  ['04-05', 1916, 'birthday', 'Gregory Peck, film star', ['film']],
  ['04-07', 1770, 'birthday', 'William Wordsworth, poet of "I wandered lonely as a cloud"', ['books']],
  ['04-12', 1961, 'event', 'Yuri Gagarin became the first person to travel into space', ['science']],
  ['04-12', 1941, 'birthday', "Bobby Moore, England's 1966 World Cup captain", ['sport']],
  ['04-15', 1939, 'birthday', 'Marty Wilde, rock and roll singer', ['music']],
  ['04-16', 1889, 'birthday', 'Charlie Chaplin, star of silent films', ['film']],
  ['04-16', 1918, 'birthday', 'Spike Milligan, comedian from "The Goon Show"', ['radio']],
  ['04-16', 1939, 'birthday', 'Dusty Springfield, singer', ['music']],
  ['04-17', 1940, 'birthday', 'Billy Fury, rock and roll singer', ['music']],
  ['04-21', 1926, 'birthday', 'Queen Elizabeth II', ['royals']],
  ['04-21', 1816, 'birthday', 'Charlotte Brontë, author of "Jane Eyre"', ['books']],
  ['04-23', null, 'celebration', "St George's Day, the patron saint of England"],
  ['04-23', 1564, 'birthday', 'William Shakespeare is traditionally said to have been born on this day', ['books']],
  ['04-23', 1928, 'birthday', 'Shirley Temple, child film star', ['film']],
  ['04-23', 1936, 'birthday', 'Roy Orbison, singer of "Oh, Pretty Woman"', ['music']],
  ['04-24', 1957, 'event', 'The first "Sky at Night" was broadcast with Patrick Moore', ['tv', 'science']],
  ['04-25', 1917, 'birthday', 'Ella Fitzgerald, jazz singer', ['music']],
  ['04-29', 1899, 'birthday', 'Duke Ellington, jazz band leader', ['music']],
  ['04-29', 1931, 'birthday', 'Lonnie Donegan, the King of Skiffle', ['music']],
  ['05-01', null, 'celebration', 'May Day: maypoles and Morris dancing'],
  ['05-02', 1936, 'birthday', 'Engelbert Humperdinck, singer of "Release Me"', ['music']],
  ['05-03', 1951, 'event', 'The Festival of Britain opened on the South Bank in London', ['places']],
  ['05-03', 1903, 'birthday', 'Bing Crosby, singer of "White Christmas"', ['music']],
  ['05-03', 1934, 'birthday', "Henry Cooper, boxer, 'Our 'Enry'", ['sport']],
  ['05-04', 1929, 'birthday', 'Audrey Hepburn, film star', ['film']],
  ['05-04', 1923, 'birthday', 'Eric Sykes, comedian and writer', ['tv']],
  ['05-06', 1954, 'event', 'Roger Bannister ran the first mile in under four minutes, in Oxford', ['sport']],
  ['05-06', 1994, 'event', 'The Channel Tunnel was officially opened', ['transport']],
  ['05-08', 1945, 'event', 'VE Day: street parties celebrated the end of the war in Europe', ['war']],
  ['05-08', 1926, 'birthday', 'Sir David Attenborough, naturalist and broadcaster', ['nature', 'tv']],
  ['05-08', 1913, 'birthday', 'Sid James, "Carry On" actor', ['film']],
  ['05-10', 1899, 'birthday', 'Fred Astaire, dancer and film star', ['film', 'music']],
  ['05-12', null, 'celebration', "International Nurses Day, on Florence Nightingale's birthday"],
  ['05-12', 1820, 'birthday', 'Florence Nightingale, founder of modern nursing'],
  ['05-12', 1937, 'event', 'The Coronation of King George VI', ['royals']],
  ['05-12', 1907, 'birthday', 'Katharine Hepburn, film star', ['film']],
  ['05-12', 1924, 'birthday', 'Tony Hancock, comedian', ['radio', 'tv']],
  ['05-13', 1950, 'birthday', 'Stevie Wonder, singer and musician', ['music']],
  ['05-14', 1926, 'birthday', 'Eric Morecambe, comedian', ['tv']],
  ['05-16', 1905, 'birthday', 'Henry Fonda, film star', ['film']],
  ['05-18', 1912, 'birthday', 'Perry Como, singer', ['music']],
  ['05-18', 1909, 'birthday', 'Fred Perry, Wimbledon tennis champion', ['sport']],
  ['05-20', 1908, 'birthday', "James Stewart, star of \"It's a Wonderful Life\"", ['film']],
  ['05-21', 1927, 'event', 'Charles Lindbergh landed in Paris after flying alone across the Atlantic', ['transport']],
  ['05-22', 1907, 'birthday', 'Laurence Olivier, actor', ['film']],
  ['05-22', 1946, 'birthday', 'George Best, footballer', ['sport']],
  ['05-24', null, 'celebration', 'Empire Day was celebrated in schools on this day for many years'],
  ['05-24', 1941, 'birthday', 'Bob Dylan, singer-songwriter', ['music']],
  ['05-26', 1907, 'birthday', 'John Wayne, film star of the westerns', ['film']],
  ['05-27', 1943, 'birthday', 'Cilla Black, singer and TV presenter', ['music', 'tv']],
  ['05-28', 1908, 'birthday', 'Ian Fleming, author of the James Bond books', ['books']],
  ['05-28', 1911, 'birthday', 'Thora Hird, actress', ['tv']],
  ['05-29', 1953, 'event', 'Edmund Hillary and Tenzing Norgay became the first to reach the top of Mount Everest', ['places']],
  ['05-29', null, 'celebration', 'Oak Apple Day, remembering the return of King Charles II'],
  ['05-30', 1909, 'birthday', 'Benny Goodman, the King of Swing', ['music']],
  ['06-01', 1926, 'birthday', 'Marilyn Monroe, film star', ['film']],
  ['06-01', 1928, 'birthday', 'Bob Monkhouse, comedian and quiz host', ['tv']],
  ['06-01', 1957, 'event', 'ERNIE picked the first winning Premium Bonds', ['money']],
  ['06-02', 1953, 'event', 'The Coronation of Queen Elizabeth II at Westminster Abbey', ['royals']],
  ['06-06', 1944, 'event', 'D-Day: Allied forces landed in Normandy', ['war']],
  ['06-07', 1946, 'event', 'BBC Television started broadcasting again after the war', ['tv']],
  ['06-07', 1917, 'birthday', 'Dean Martin, singer and actor', ['music']],
  ['06-07', 1940, 'birthday', 'Tom Jones, singer from Pontypridd', ['music']],
  ['06-08', 1949, 'event', 'George Orwell\'s novel "Nineteen Eighty-Four" was published', ['books']],
  ['06-10', 1921, 'birthday', 'Prince Philip, Duke of Edinburgh', ['royals']],
  ['06-10', 1922, 'birthday', 'Judy Garland, star of "The Wizard of Oz"', ['film']],
  ['06-15', 1215, 'event', 'King John agreed to Magna Carta at Runnymede', ['history']],
  ['06-16', 1890, 'birthday', 'Stan Laurel, of Laurel and Hardy', ['film']],
  ['06-18', 1942, 'birthday', 'Paul McCartney of The Beatles', ['music']],
  ['06-22', 1948, 'event', 'HMT Empire Windrush arrived at Tilbury Docks', ['history']],
  ['06-23', 1940, 'birthday', 'Adam Faith, singer and actor', ['music']],
  ['06-24', null, 'celebration', 'Midsummer Day'],
  ['06-27', 1967, 'event', "The world's first cash machine opened at a bank in Enfield, North London", ['money']],
  ['07-01', 1967, 'event', 'BBC2 began the first regular colour TV broadcasts in Europe, starting with Wimbledon', ['tv', 'sport']],
  ['07-01', 1903, 'birthday', 'Amy Johnson, record-breaking pilot from Hull', ['transport']],
  ['07-03', 1938, 'event', 'The steam locomotive Mallard set a world speed record of 126 miles per hour', ['transport']],
  ['07-04', 1954, 'event', 'Food rationing finally ended in Britain', ['food']],
  ['07-05', 1948, 'event', 'The National Health Service (NHS) was founded'],
  ['07-06', 1925, 'birthday', 'Bill Haley, of "Rock Around the Clock"', ['music']],
  ['07-06', 1939, 'birthday', 'Mary Peters, Olympic champion', ['sport']],
  ['07-07', 1940, 'birthday', 'Ringo Starr of The Beatles', ['music']],
  ['07-10', 1962, 'event', 'The Telstar satellite was launched, sending TV pictures across the Atlantic', ['tv', 'science']],
  ['07-10', 1945, 'birthday', 'Virginia Wade, Wimbledon champion in 1977', ['sport']],
  ['07-13', 1985, 'event', 'The Live Aid concerts were held in London and Philadelphia', ['music']],
  ['07-14', null, 'celebration', 'Bastille Day in France'],
  ['07-17', 1955, 'event', 'Disneyland opened in California', ['places']],
  ['07-18', 1918, 'birthday', 'Nelson Mandela'],
  ['07-20', 1969, 'event', 'Apollo 11 landed on the Moon; Neil Armstrong was the first person to walk on it', ['science']],
  ['07-26', 1943, 'birthday', 'Mick Jagger of The Rolling Stones', ['music']],
  ['07-28', 1866, 'birthday', 'Beatrix Potter, author of "Peter Rabbit"', ['books']],
  ['07-29', 1948, 'event', 'The London Olympic Games opened at Wembley', ['sport']],
  ['07-29', 1954, 'event', 'Tolkien\'s "The Fellowship of the Ring" was published', ['books']],
  ['07-29', 1981, 'event', 'Prince Charles married Lady Diana Spencer at St Paul\'s Cathedral', ['royals']],
  ['07-30', 1966, 'event', 'England won the football World Cup, beating West Germany 4–2 at Wembley', ['sport']],
  ['07-30', 1818, 'birthday', 'Emily Brontë, author of "Wuthering Heights"', ['books']],
  ['08-01', null, 'celebration', 'Yorkshire Day'],
  ['08-03', 1926, 'birthday', 'Tony Bennett, singer', ['music']],
  ['08-03', 1938, 'birthday', 'Terry Wogan, broadcaster', ['radio', 'tv']],
  ['08-04', 1900, 'birthday', 'Queen Elizabeth the Queen Mother', ['royals']],
  ['08-04', 1901, 'birthday', 'Louis Armstrong, jazz trumpeter: "What a Wonderful World"', ['music']],
  ['08-05', 1930, 'birthday', 'Neil Armstrong, the first person to walk on the Moon', ['science']],
  ['08-06', 1937, 'birthday', 'Barbara Windsor, actress', ['film', 'tv']],
  ['08-11', 1897, 'birthday', 'Enid Blyton, author of "The Famous Five"', ['books']],
  ['08-13', 1899, 'birthday', 'Alfred Hitchcock, film director', ['film']],
  ['08-15', 1945, 'event', 'VJ Day marked the end of the Second World War', ['war']],
  ['08-20', 1923, 'birthday', 'Jim Reeves, country singer', ['music']],
  ['08-21', 1930, 'birthday', 'Princess Margaret', ['royals']],
  ['08-21', 1904, 'birthday', 'Count Basie, jazz pianist and band leader', ['music']],
  ['08-23', 1912, 'birthday', 'Gene Kelly, star of "Singin\' in the Rain"', ['film', 'music']],
  ['08-25', 1930, 'birthday', 'Sean Connery, the first film James Bond', ['film']],
  ['08-26', 1959, 'event', 'The Mini car was launched', ['cars']],
  ['08-26', 1910, 'birthday', 'Mother Teresa'],
  ['08-27', 1908, 'birthday', 'Don Bradman, cricketer', ['sport']],
  ['08-28', 1963, 'event', 'Martin Luther King Jr. gave his "I Have a Dream" speech'],
  ['08-29', 1915, 'birthday', 'Ingrid Bergman, star of "Casablanca"', ['film']],
  ['09-04', 1964, 'event', 'The Queen opened the Forth Road Bridge in Scotland', ['places', 'royals']],
  ['09-05', 1946, 'birthday', 'Freddie Mercury of Queen', ['music']],
  ['09-07', 1936, 'birthday', 'Buddy Holly, rock and roll singer', ['music']],
  ['09-08', 1966, 'event', 'The Severn Bridge between England and Wales was opened by the Queen', ['places', 'royals']],
  ['09-08', 1921, 'birthday', 'Harry Secombe, singer and Goon', ['radio', 'music']],
  ['09-08', 1925, 'birthday', 'Peter Sellers, comedian and actor', ['film']],
  ['09-08', 1932, 'birthday', 'Patsy Cline, singer of "Crazy"', ['music']],
  ['09-12', 1913, 'birthday', 'Jesse Owens, Olympic sprinter', ['sport']],
  ['09-13', 1916, 'birthday', 'Roald Dahl, author of "Charlie and the Chocolate Factory"', ['books']],
  ['09-15', 1890, 'birthday', 'Agatha Christie, author of the Poirot and Miss Marple stories', ['books']],
  ['09-17', 1923, 'birthday', 'Hank Williams, country singer', ['music']],
  ['09-20', 1914, 'birthday', 'Kenneth More, actor', ['film']],
  ['09-20', 1934, 'birthday', 'Sophia Loren, film star', ['film']],
  ['09-22', 1955, 'event', 'ITV began broadcasting, the first commercial TV channel in Britain', ['tv']],
  ['09-22', 1915, 'birthday', 'Arthur Lowe, Captain Mainwaring in "Dad\'s Army"', ['tv']],
  ['09-23', 1930, 'birthday', 'Ray Charles, singer and pianist', ['music']],
  ['09-23', 1920, 'birthday', 'Mickey Rooney, actor', ['film']],
  ['09-25', 1929, 'birthday', 'Ronnie Barker, of "The Two Ronnies" and "Porridge"', ['tv']],
  ['09-26', 1934, 'event', 'The ocean liner Queen Mary was launched on the Clyde', ['transport']],
  ['09-27', 1825, 'event', 'The Stockton and Darlington Railway opened, the first public steam railway', ['transport']],
  ['09-28', 1928, 'event', 'Alexander Fleming discovered penicillin', ['science']],
  ['09-28', 1934, 'birthday', 'Brigitte Bardot, film star', ['film']],
  ['09-28', 1946, 'birthday', 'Helen Shapiro, singer of "Walkin\' Back to Happiness"', ['music']],
  ['09-29', null, 'celebration', 'Michaelmas Day'],
  ['09-29', 1935, 'birthday', 'Jerry Lee Lewis, rock and roll pianist', ['music']],
  ['10-01', null, 'celebration', 'International Day of Older Persons'],
  ['10-01', 1935, 'birthday', 'Julie Andrews, star of "Mary Poppins"', ['film', 'music']],
  ['10-02', 1869, 'birthday', 'Mahatma Gandhi'],
  ['10-04', 1957, 'event', 'Sputnik 1, the first satellite, was launched into space', ['science']],
  ['10-05', 1962, 'event', 'The first James Bond film, "Dr. No", had its premiere in London', ['film']],
  ['10-05', 1962, 'event', 'The Beatles released their first single, "Love Me Do"', ['music']],
  ['10-05', 1969, 'event', '"Monty Python\'s Flying Circus" was first shown on BBC television', ['tv']],
  ['10-07', 1952, 'event', 'The barcode was patented in the United States', ['science']],
  ['10-07', 1959, 'event', 'A space probe sent back the first photographs of the far side of the Moon', ['science']],
  ['10-09', 1940, 'birthday', 'John Lennon of The Beatles', ['music']],
  ['10-11', 1937, 'birthday', 'Bobby Charlton, footballer', ['sport']],
  ['10-14', 1927, 'birthday', 'Roger Moore, actor', ['film', 'tv']],
  ['10-14', 1940, 'birthday', 'Cliff Richard, singer', ['music']],
  ['10-16', 1958, 'event', 'The first "Blue Peter" was shown on BBC television', ['tv']],
  ['10-16', 1922, 'birthday', 'Max Bygraves, singer and entertainer', ['music', 'tv']],
  ['10-18', 1926, 'birthday', 'Chuck Berry, rock and roll guitarist', ['music']],
  ['10-20', 1973, 'event', 'The Queen opened the Sydney Opera House', ['places', 'royals']],
  ['10-21', null, 'celebration', 'Trafalgar Day, remembering Admiral Nelson', ['war']],
  ['10-23', 1940, 'birthday', 'Pelé, Brazilian footballer', ['sport']],
  ['10-28', 1886, 'event', 'The Statue of Liberty was dedicated in New York', ['places']],
  ['10-31', null, 'celebration', 'Halloween: apple bobbing and lanterns'],
  ['11-01', null, 'celebration', "All Saints' Day"],
  ['11-01', 1956, 'event', 'Premium Bonds went on sale for the first time', ['money']],
  ['11-02', 1936, 'event', 'The BBC began the world\'s first regular high-definition TV service, from Alexandra Palace', ['tv']],
  ['11-02', 1959, 'event', 'The first section of the M1 motorway opened', ['transport', 'cars']],
  ['11-03', 1948, 'birthday', 'Lulu, singer of "Shout"', ['music']],
  ['11-04', 1922, 'event', "Howard Carter found the steps to Tutankhamun's tomb in Egypt", ['history']],
  ['11-05', null, 'celebration', 'Bonfire Night: "Remember, remember the fifth of November"'],
  ['11-05', 1913, 'birthday', 'Vivien Leigh, star of "Gone with the Wind"', ['film']],
  ['11-08', 1927, 'birthday', 'Ken Dodd, comedian from Knotty Ash', ['tv']],
  ['11-09', 1989, 'event', 'The Berlin Wall was opened and people celebrated in the streets', ['history']],
  ['11-11', null, 'celebration', 'Remembrance Day: two minutes of silence at 11 o\'clock', ['war']],
  ['11-12', 1929, 'birthday', 'Grace Kelly, film star and Princess of Monaco', ['film']],
  ['11-14', 1948, 'birthday', 'King Charles III', ['royals']],
  ['11-15', 1932, 'birthday', 'Petula Clark, singer of "Downtown"', ['music']],
  ['11-17', 1925, 'birthday', 'Rock Hudson, film star', ['film']],
  ['11-18', 1928, 'event', 'Mickey Mouse appeared in "Steamboat Willie"', ['film']],
  ['11-20', 1947, 'event', 'Princess Elizabeth married Philip Mountbatten at Westminster Abbey', ['royals']],
  ['11-23', 1963, 'event', 'The first episode of "Doctor Who" was shown', ['tv']],
  ['11-25', 1952, 'event', 'Agatha Christie\'s play "The Mousetrap" opened in London', ['books']],
  ['11-27', 1925, 'birthday', 'Ernie Wise, comedian', ['tv']],
  ['11-29', 1898, 'birthday', 'C.S. Lewis, author of "The Lion, the Witch and the Wardrobe"', ['books']],
  ['11-30', null, 'celebration', "St Andrew's Day, the patron saint of Scotland"],
  ['11-30', 1874, 'birthday', 'Winston Churchill'],
  ['12-01', 1955, 'event', 'Rosa Parks refused to give up her bus seat in Alabama'],
  ['12-01', 1930, 'birthday', 'Matt Monro, singer of "From Russia with Love"', ['music']],
  ['12-03', 1927, 'birthday', 'Andy Williams, singer of "Moon River"', ['music']],
  ['12-04', 1930, 'birthday', 'Ronnie Corbett, of "The Two Ronnies"', ['tv']],
  ['12-05', 1958, 'event', "Britain's first motorway, the Preston bypass, was opened", ['transport', 'cars']],
  ['12-05', 1901, 'birthday', 'Walt Disney', ['film']],
  ['12-05', 1932, 'birthday', 'Little Richard, singer of "Tutti Frutti"', ['music']],
  ['12-09', 1960, 'event', 'The first episode of "Coronation Street" was shown', ['tv']],
  ['12-09', 1934, 'birthday', 'Judi Dench, actress', ['film']],
  ['12-10', null, 'celebration', 'Nobel Prizes are presented every year on this day'],
  ['12-12', 1915, 'birthday', 'Frank Sinatra, singer', ['music']],
  ['12-12', 1937, 'birthday', 'Connie Francis, singer', ['music']],
  ['12-14', 1911, 'event', 'Roald Amundsen and his team reached the South Pole', ['places']],
  ['12-16', 1775, 'birthday', 'Jane Austen, author of "Pride and Prejudice"', ['books']],
  ['12-17', 1903, 'event', 'The Wright brothers made the first powered aeroplane flight', ['transport']],
  ['12-21', 1937, 'event', 'Walt Disney\'s "Snow White and the Seven Dwarfs" had its premiere', ['film']],
  ['12-24', null, 'celebration', 'Christmas Eve'],
  ['12-25', null, 'celebration', 'Christmas Day'],
  ['12-25', 1932, 'event', 'King George V gave the first royal Christmas broadcast on the radio', ['royals', 'radio']],
  ['12-25', 1957, 'event', "The Queen's Christmas message was shown on television for the first time", ['royals', 'tv']],
  ['12-26', null, 'celebration', 'Boxing Day'],
  ['12-28', 1934, 'birthday', 'Maggie Smith, actress', ['film']],
  ['12-30', 1865, 'birthday', 'Rudyard Kipling, author of "The Jungle Book"', ['books']],
  ['12-31', null, 'celebration', "New Year's Eve, or Hogmanay in Scotland"],
  // Additional entries to fill quieter dates.
  ['04-08', 1904, 'event', 'Britain and France signed the Entente Cordiale, a friendship agreement', ['history']],
  ['04-13', 1742, 'event', 'Handel\'s "Messiah" was performed for the first time, in Dublin', ['music']],
  ['08-12', 1981, 'event', 'The IBM Personal Computer went on sale', ['science']],
  ['08-15', 1969, 'event', 'The Woodstock music festival began in New York State', ['music']],
  ['08-17', 1943, 'birthday', 'Robert De Niro, film star', ['film']],
  ['09-06', 1620, 'event', 'The Mayflower set sail from Plymouth for America', ['transport', 'history']],
  ['06-21', null, 'celebration', 'Around now: the summer solstice, the longest day of the year', ['seasons']],
  ['12-21', null, 'celebration', 'Around now: the winter solstice, the shortest day of the year', ['seasons']],
  ['01-02', 1920, 'birthday', 'Isaac Asimov, science fiction author', ['books', 'science']],
  ['01-04', 1643, 'birthday', 'Isaac Newton, scientist (by the modern calendar)', ['science']],
  ['01-04', 1809, 'birthday', 'Louis Braille, inventor of the Braille reading system'],
  ['01-05', null, 'celebration', 'Twelfth Night, the last evening of the Christmas season'],
  ['01-07', 1610, 'event', 'Galileo first saw the moons of Jupiter through his telescope', ['science']],
  ['01-11', 1922, 'event', 'Insulin was first used to treat a person with diabetes', ['science']],
  ['01-13', 1926, 'birthday', 'Michael Bond, author of the Paddington Bear books', ['books']],
  ['01-20', 1930, 'birthday', 'Buzz Aldrin, astronaut who walked on the Moon', ['science']],
  ['01-22', 1788, 'birthday', 'Lord Byron, poet', ['books']],
  ['01-24', 1908, 'event', 'The first part of "Scouting for Boys" by Robert Baden-Powell was published', ['childhood']],
  ['01-28', 1813, 'event', 'Jane Austen\'s "Pride and Prejudice" was published', ['books']],
  ['01-30', 1969, 'event', 'The Beatles played their last live performance, on a rooftop in London', ['music']],
  ['01-31', 1958, 'event', 'Explorer 1, the first American satellite, was launched', ['science']],
  ['02-02', null, 'celebration', 'Candlemas, halfway between winter and spring'],
  ['02-06', null, 'celebration', 'Waitangi Day in New Zealand'],
  ['02-09', 1964, 'event', 'The Beatles appeared on "The Ed Sullivan Show" in America', ['music', 'tv']],
  ['02-11', 1990, 'event', 'Nelson Mandela was released from prison after 27 years'],
  ['02-16', 1923, 'event', "Howard Carter opened the sealed burial chamber of Tutankhamun's tomb", ['history']],
  ['02-21', 1804, 'event', 'Richard Trevithick\'s steam locomotive made the first railway journey, in Wales', ['transport']],
  ['02-18', 1930, 'event', 'The planet Pluto was discovered by Clyde Tombaugh', ['science']],
  ['02-20', 1962, 'event', 'John Glenn became the first American to orbit the Earth', ['science']],
  ['02-23', 1685, 'birthday', 'George Frideric Handel, composer of "Messiah"', ['music']],
  ['02-29', null, 'celebration', 'Leap Day, which comes only once every four years'],
  ['03-03', 1847, 'birthday', 'Alexander Graham Bell, inventor of the telephone', ['science']],
  ['03-08', null, 'celebration', "International Women's Day"],
  ['03-09', 1959, 'event', 'The Barbie doll was shown for the first time at a toy fair in New York', ['childhood']],
  ['03-13', 1781, 'event', 'William Herschel discovered the planet Uranus from his garden in Bath', ['science']],
  ['04-06', 1896, 'event', 'The first modern Olympic Games opened in Athens', ['sport']],
  ['04-22', null, 'celebration', 'Earth Day'],
  ['05-07', 1833, 'birthday', 'Johannes Brahms, composer of the famous lullaby', ['music']],
  ['05-07', 1840, 'birthday', 'Pyotr Tchaikovsky, composer of "Swan Lake"', ['music']],
  ['05-09', 1860, 'birthday', 'J.M. Barrie, author of "Peter Pan"', ['books']],
  ['05-11', 1904, 'birthday', 'Salvador Dalí, artist'],
  ['05-31', 1930, 'birthday', 'Clint Eastwood, film star', ['film']],
  ['06-05', null, 'celebration', 'World Environment Day', ['nature']],
  ['06-11', 1910, 'birthday', 'Jacques Cousteau, undersea explorer', ['nature']],
  ['06-21', 1982, 'birthday', 'Prince William', ['royals']],
  ['06-25', 1903, 'birthday', 'George Orwell, author of "Animal Farm"', ['books']],
  ['06-26', 1945, 'event', 'The United Nations Charter was signed in San Francisco', ['history']],
  ['07-15', null, 'celebration', "St Swithin's Day: if it rains today, they say it will rain for forty days"],
  ['07-21', 1899, 'birthday', 'Ernest Hemingway, author', ['books']],
  ['07-24', 1897, 'birthday', 'Amelia Earhart, record-breaking pilot', ['transport']],
  ['07-31', 1965, 'birthday', 'J.K. Rowling, author of the Harry Potter books', ['books']],
  ['08-19', null, 'celebration', 'World Photography Day'],
  ['08-30', 1797, 'birthday', 'Mary Shelley, author of "Frankenstein"', ['books']],
  ['09-18', 1709, 'birthday', 'Samuel Johnson, who wrote a famous English dictionary', ['books']],
  ['09-21', 1866, 'birthday', 'H.G. Wells, author of "The Time Machine"', ['books']],
  ['09-24', 1936, 'birthday', 'Jim Henson, creator of the Muppets', ['tv']],
  ['10-24', null, 'celebration', 'United Nations Day'],
  ['10-25', 1881, 'birthday', 'Pablo Picasso, artist'],
  ['10-27', 1914, 'birthday', 'Dylan Thomas, Welsh poet', ['books']],
  ['11-07', 1867, 'birthday', 'Marie Curie, scientist and double Nobel Prize winner', ['science']],
  ['11-13', 1850, 'birthday', 'Robert Louis Stevenson, author of "Treasure Island"', ['books']],
  ['11-24', 1859, 'event', 'Charles Darwin\'s "On the Origin of Species" was published', ['science', 'books']],
  ['11-26', 1922, 'birthday', 'Charles Schulz, creator of Snoopy and Charlie Brown', ['books']],
  ['11-28', 1757, 'birthday', 'William Blake, poet who wrote the words of "Jerusalem"', ['books']],
  ['12-06', null, 'celebration', 'St Nicholas Day'],
  ['12-13', null, 'celebration', "St Lucia's Day, a festival of light"],
  ['12-19', 1843, 'event', 'Charles Dickens\'s "A Christmas Carol" was published', ['books', 'christmas']],
  ['12-27', 1822, 'birthday', 'Louis Pasteur, scientist', ['science']],
];

export interface HistoryItem {
  date: string;
  year: number | null;
  kind: HistoryKind;
  text: string;
  tags: string[];
}

export const HISTORY: HistoryItem[] = ROWS.map(([date, year, kind, text, tags]) => ({
  date,
  year,
  kind,
  text,
  tags: tags ?? [],
}));

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Traditional British birthstones and birth flowers. */
export const MONTH_FACTS: { stone: string; flower: string; saying?: string }[] = [
  { stone: 'Garnet', flower: 'Snowdrop', saying: 'January brings the snow, makes our feet and fingers glow.' },
  { stone: 'Amethyst', flower: 'Primrose', saying: "February brings the rain, thaws the frozen lake again." },
  { stone: 'Aquamarine', flower: 'Daffodil', saying: 'March comes in like a lion and goes out like a lamb.' },
  { stone: 'Diamond', flower: 'Sweet pea', saying: 'April showers bring forth May flowers.' },
  { stone: 'Emerald', flower: 'Lily of the valley', saying: "Ne'er cast a clout till May be out." },
  { stone: 'Pearl', flower: 'Rose', saying: 'June brings tulips, lilies, roses, fills the children\'s hands with posies.' },
  { stone: 'Ruby', flower: 'Water lily', saying: 'Hot July brings cooling showers, apricots and gillyflowers.' },
  { stone: 'Peridot', flower: 'Gladiolus', saying: 'August brings the sheaves of corn, then the harvest home is borne.' },
  { stone: 'Sapphire', flower: 'Aster', saying: 'Warm September brings the fruit; sportsmen then begin to shoot.' },
  { stone: 'Opal', flower: 'Marigold', saying: 'Fresh October brings the pheasant; then to gather nuts is pleasant.' },
  { stone: 'Topaz', flower: 'Chrysanthemum', saying: 'Dull November brings the blast; then the leaves are whirling fast.' },
  { stone: 'Turquoise', flower: 'Holly', saying: 'Chill December brings the sleet, blazing fire and Christmas treat.' },
];

export function dateKey(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Western Easter Sunday (anonymous Gregorian algorithm). */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}

function nthWeekday(year: number, month: number, weekday: number, n: number) {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

/** Celebrations whose date changes every year. */
export function moveableCelebrations(year: number): HistoryItem[] {
  const easter = easterSunday(year);
  const list: [Date, string, string[]][] = [
    [addDays(easter, -47), 'Shrove Tuesday: Pancake Day!', ['food']],
    [addDays(easter, -21), 'Mothering Sunday', []],
    [addDays(easter, -2), 'Good Friday: hot cross buns', ['faith']],
    [easter, 'Easter Sunday', ['faith']],
    [addDays(easter, 1), 'Easter Monday bank holiday', []],
    [nthWeekday(year, 5, 0, 3), "Father's Day", []],
    [nthWeekday(year, 10, 0, 2), 'Remembrance Sunday', ['war']],
  ];
  return list.map(([d, text, tags]) => ({ date: dateKey(d), year: null, kind: 'celebration', text, tags }));
}

export function isAvoided(item: { tags: string[] }, avoid: string[]) {
  if (avoid.length === 0) return false;
  const lower = avoid.map((a) => a.toLowerCase().trim());
  return item.tags.some((t) => lower.includes(t));
}

export function itemsForDate(d: Date, avoid: string[] = []): HistoryItem[] {
  const key = dateKey(d);
  return [...moveableCelebrations(d.getFullYear()), ...HISTORY]
    .filter((h) => h.date === key && !isAvoided(h, avoid))
    .sort(byKind);
}

/** Items from the days either side, so every date has something to talk about. */
export function itemsThisWeek(d: Date, avoid: string[] = [], spread = 3): HistoryItem[] {
  const out: HistoryItem[] = [];
  for (let i = -spread; i <= spread; i++) {
    if (i === 0) continue;
    out.push(...itemsForDate(addDays(d, i), avoid).filter((h) => h.kind !== 'celebration'));
  }
  return out;
}

export function itemsForYear(year: number, avoid: string[] = []) {
  return HISTORY.filter((h) => h.year === year && h.kind === 'event' && !isAvoided(h, avoid));
}

function byKind(a: HistoryItem, b: HistoryItem) {
  const order: Record<HistoryKind, number> = { celebration: 0, event: 1, birthday: 2 };
  return order[a.kind] - order[b.kind] || (a.year ?? 0) - (b.year ?? 0);
}

/** Memories of growing up in each decade, used for the "your birth year" view. */
export const DECADES: Record<number, { title: string; memories: string[] } | undefined> = {
  1920: {
    title: 'The 1920s',
    memories: ['Silent films at the picture house', 'The first BBC radio broadcasts', 'Flapper dresses and the Charleston', 'Horse-drawn milk carts'],
  },
  1930: {
    title: 'The 1930s',
    memories: ['Listening to the wireless', 'Saturday matinées at the cinema', 'Shirley Temple and Fred Astaire films', 'Steam trains to the seaside', 'Penny sweets from a jar'],
  },
  1940: {
    title: 'The 1940s',
    memories: ['Ration books and queues', 'Dig for Victory gardens', 'Big band music and dance halls', 'Utility clothing', 'The new NHS in 1948'],
  },
  1950: {
    title: 'The 1950s',
    memories: ["The Coronation on a neighbour's television", 'Rock and roll and teddy boys', 'Coffee bars and jukeboxes', 'The end of rationing', 'Holidays at Butlins'],
  },
  1960: {
    title: 'The 1960s',
    memories: ['The Beatles and Beatlemania', 'Mini skirts and the Mini car', 'England winning the World Cup', 'The Moon landing on TV', 'Coronation Street begins'],
  },
  1970: {
    title: 'The 1970s',
    memories: ['Decimal money', 'Flares and platform shoes', 'Package holidays to Spain', 'The Silver Jubilee street parties', 'Colour television in more homes'],
  },
  1980: {
    title: 'The 1980s',
    memories: ['The royal wedding in 1981', 'Live Aid', 'Home computers', 'Walkman cassette players'],
  },
};

export function decadeOf(year: number) {
  return DECADES[Math.floor(year / 10) * 10];
}
