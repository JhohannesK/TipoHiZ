import Link from 'next/link';
import React from 'react';
import Chip from './UI/Chip';
import { AiOutlineBranches } from 'react-icons/ai';
import { SiAdguard } from 'react-icons/si';
import Image from 'next/image';
import SVGIMG from '../public/assets/1161953_instagram_icon.svg';
import DISCORD from '../public/assets//2959743_chat_discord_gaming_icon.svg';
import TWITTER from '../public/assets/5305170_bird_social media_social network_tweet_twitter_icon.svg';
function Footer() {
   return (
      <div className="flex flex-col items-center justify-center w-full gap-8 border-t-2 text-input">
         <div className="flex items-center justify-center gap-3">
            <Chip className="bg-foreground text-input" name="tab" /> +{' '}
            <Chip className="bg-foreground text-input" name="enter" /> to reset
            test
         </div>
         <div className="pb-[58px] w-full flex items-center gap-2 justify-between">
            <div>
               <p className="flex items-center justify-center gap-2">
                  Contribute on Github{' '}
                  <span className="text-sm text-primary">
                     <Link
                        tabIndex={-1}
                        aria-label="Link to TipoHiZ on GitHub"
                        className="font-bold"
                        href="https://github.com/JhohannesK/TipoHiZ"
                     >{`\<TipoHiZ/\>`}</Link>
                  </span>
               </p>
               <p>Follow us on</p>
               <div style={{ display: 'inline-flex;' }}>
                  <a href="https://www.w3schools.com">
                     <Image src={SVGIMG} alt={''} />
                  </a>
                  <a href="https://discord.gg/8Z67Fv8z">
                     <Image src={DISCORD} alt={''} height="57" width="57" />
                  </a>
                  <a href="https://www.w3schools.com">
                     <Image src={TWITTER} alt={''} height="57" width="57" />
                  </a>
               </div>
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <AiOutlineBranches />
                  <div>v0.0.2</div>
               </div>
            </div>
            <div>
               <div className="flex items-center gap-2">
                  <SiAdguard />
                  <div>Privacy policy and terms of use</div>
               </div>
            </div>
         </div>
      </div>
   );
}

export default Footer;
