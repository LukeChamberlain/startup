import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './database.css';

export default function Database() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSong = location.state?.song;
  const filters = location.state?.filters;

  console.log("Received song:", selectedSong, "and filters:", filters);

  if (!selectedSong || !filters) {
    return (
      <main className="container-fluid bg-secondary text-center">
        <h1>Error: Missing Song or Filters</h1>
      </main>
    );
  }

  // Sample song lyrics for demonstration
  const songLyrics = {
    'Song Title 1': 'ass',
    'Song Title 2': 'Lyrics with violent language and more',
    'Song Title 3': 'Lyrics without any flagged content',
    'Another Song': 'Suggestive topics and more',
    'Different Song': 'Clean lyrics, nothing offensive here',
  };

  // Fetch lyrics for the selected song
  const lyrics = songLyrics[selectedSong] || '';

  // Define filter conditions and match them to the filters object
  const filterConditions = {
    swearWords: /(?:\b(?:damn|hell|crap|bastard|ass|shit|fuck|bitch|fucker|asshole|bullshit|cunt|cock|cocksucker|dammit|dumbass|fag|faggot|fucking|shite|slut|whore|twat|prick|piss|jackass|arse|arsehole|bastards|dick|dickhead|motherfucker|goddamn|hellhole|screw|douche|dipshit|butthead|scumbag|son of a bitch|twatface|piss off|twathead|bugger|bloody|tosser|wanker|pillock|git|nonce|slag|berk|wazzock|minger|knob|muppet|numpty|turd|bellend|mong|knobhead|shithead|knob jockey|plonker|pikey|git|boffin|numbnuts)\b)/gi,
    violentLanguage: /(?:\b(?:kill|murder|assault|fight|violence|stab|weapon|punch|rape|slaughter|torture|blood|shoot|gun|bomb|hostage|beat|choke|attack|abuse|brutal|strangle|hang|execute|suicide|self-harm|harm|maim|lynch|exterminate|bludgeon|poison|decapitate|terrorist|massacre|behead|slit|suffocate|grenade|molest|threat|predator|victim|assail|quarrel|cutthroat|kick|batter|aggress|pistol-whip|strangulation|molotov|martyr|rampage|riot|annihilate|machete|ambush|brawl|warfare|combat|shootout|riot)\b)/gi,
    raciallyAggressive: /(?:\b(?:ape|bimbo|cotton picker|chow|coonass|cracker|crow|japs|jap|jew|niglet|nigger|niger|niggar|nigga|redskin|chink|gook|spic|wetback|paki|dothead|gypsy|hebe|honky|savage|yellow|towelhead|oriental|gringo|mulatto|half-breed|beaner|tarbaby|squaw|redman|pickaninny|jungle bunny|darky|darkie|zipperhead|sandnigger|kike|raghead|hillbilly|hilljack|cheesehead|yankee|redneck|whitey|snowflake|bushman|greaseball|heathen|drunkard|barbarian|eurotrash|hillbilly|redleg|monkey|burrhead|honky|bluegum|guido|boong|eskimo|frito|pale face|squarehead|swamper|incel|brownie|wasian|mosshead|reefer|peckerwood)\b)/gi,
    sexualInnuendo: /(?:\b(?:sex|innuendo|explicit|seductive|provocative|nudity|porno|erotic|adult|XXX|fetish|kinky|orgasm|hardcore|strip|masturbate|fornicate|lewd|naked|nude|raunchy|risqué|lust|seduce|sexy|pervert|voyeur|flirt|passionate|horny|thrust|sensual|sultry|tempt|desire|nookie|quickie|booty|thong|pussy|bj|handjob|make out|luscious|nipple|boobs|cleavage|softcore|penetration|sexting|playboy|dirty|grind|sizzle|eroticism|foreplay|stripper|pole dance|panties|down and dirty|screw|hook up|hustler|one-night stand|red-light|prostitute|call girl|escort|sex worker|swinger|bareback|submissive|dominant|bdsm|handcuffs|naughty|bad girl|taboo|pleasure|fondle|cuddle|smut|kisses)\b)/gi,
    suggestiveTopics: /(?:\b(?:drug|alcohol|abuse|gambling|intoxicated|substance|weed|marijuana|cocaine|meth|heroin|LSD|acid|crack|overdose|opium|smoke|stoned|high|drunk|buzzed|addiction|casino|lottery|pills|overdrink|binge|intoxicate|psychedelic|trip|hallucinate|blackout|dependency|vape|narcotics|tobacco|e-cigarette|cigarette|cannabis|pot|hookah|beer|wine|liquor|binge drink|moonshine|hashish|molly|mushrooms|shrooms|ecstasy|party drugs|barbiturate|methamphetamine|opiates|heroin|hash|lean|spiked|sedative|poppy|booze|hydrocodone|oxy|painkiller|codeine|uppers|downers|sizzurp|scante|dope|blow|sniff|doobie|joint|pipe|blunt|dab|dab rig|vaping|chew)\b)/gi,
  };

  // Check if any selected filter has a match in the song lyrics
  const hasOffensiveContent = Object.entries(filters).some(
    ([filterKey, isSelected]) =>
      isSelected && filterConditions[filterKey]?.test(lyrics)
  );

  // Handle adding the song to the user's profile
  const handleAddToProfile = () => {
    const songData = {
      title: selectedSong,
      artist: 'Unknown Artist', // Adjust as needed
      status: hasOffensiveContent ? 'Explicit' : 'Clean',
    };
    navigate('/profile'); // Redirect to profile after adding
  };

  return (
    <main className="container-fluid bg-secondary text-center">
      <div>
        <h1>{hasOffensiveContent ? 'Not Certified Clean ❌' : 'Certified Clean ✅'}</h1>
        <p>Song: {selectedSong}</p>
        <p>Lyrics: {lyrics}</p>
        <button className="btn btn-primary" onClick={handleAddToProfile}>Add to Profile</button>
      </div>
    </main>
  );
}
