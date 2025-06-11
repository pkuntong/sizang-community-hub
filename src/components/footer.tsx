import React from "react";
import { Link } from "@heroui/react"; // Added missing Link import from HeroUI
import { Link as RouterLink } from "react-router-dom";
import { Icon } from "@iconify/react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-content1 border-t border-divider py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4 text-lg">Sizang Community Hub</h3>
            <p className="text-foreground-500 text-sm">
              A private digital space for the global Sizang (Siyin) people to connect, share, and preserve our culture.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Community</h4>
            <ul className="space-y-2">
              <li><Link as={RouterLink} to="/forums" color="foreground" size="sm">Forums</Link></li>
              <li><Link as={RouterLink} to="/groups" color="foreground" size="sm">Groups</Link></li>
              <li><Link as={RouterLink} to="/events" color="foreground" size="sm">Events</Link></li>
              <li><Link as={RouterLink} to="/members" color="foreground" size="sm">Members</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link as={RouterLink} to="/resources?category=language" color="foreground" size="sm">Language Resources</Link></li>
              <li><Link as={RouterLink} to="/resources?category=culture" color="foreground" size="sm">Cultural Archive</Link></li>
              <li><Link as={RouterLink} to="/community-guidelines" color="foreground" size="sm">Community Guidelines</Link></li>
              <li><Link as={RouterLink} to="/help" color="foreground" size="sm">Help Center</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Connect</h4>
            <div className="flex gap-4 mb-4">
              <Link href="#" isExternal aria-label="Facebook">
                <Icon icon="logos:facebook" className="text-2xl" />
              </Link>
              <Link href="#" isExternal aria-label="YouTube">
                <Icon icon="logos:youtube-icon" className="text-2xl" />
              </Link>
              <Link href="#" isExternal aria-label="Email">
                <div className="w-6 h-6 flex items-center justify-center">
                  <Icon icon="lucide:mail" className="text-xl" />
                </div>
              </Link>
            </div>
            <p className="text-foreground-500 text-xs">
              Contact: info@sizangcommunity.org
            </p>
          </div>
        </div>
        
        <div className="border-t border-divider mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground-500 text-xs mb-4 md:mb-0 text-center md:text-left">
            © {new Date().getFullYear()} Sizang Community Hub. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link as={RouterLink} to="/privacy-policy" color="foreground" size="sm">Privacy Policy</Link>
            <Link as={RouterLink} to="/terms-of-service" color="foreground" size="sm">Terms of Service</Link>
            <Link as={RouterLink} to="/community-guidelines" color="foreground" size="sm">Community Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};