import ButtonLink from '../ButtonLink';
import { IconList, IconRadar, IconSettings } from '@tabler/icons-react';

const Menu = () => {
  return (
    <nav className="flex h-full flex-col gap-4 overflow-auto p-5">
      <h1 className="w-full text-center">CleanX</h1>
      <ul className="flex flex-col gap-2.5">
        <li>
          <ButtonLink to="/">
            <IconRadar />
            <span>Scanner</span>
          </ButtonLink>
        </li>
        <li>
          <ButtonLink to="/scans">
            <IconList />
            <span>Explorer mes scans</span>
          </ButtonLink>
        </li>
      </ul>
      <ButtonLink to="/settings" className="mt-auto">
        <IconSettings />
        <span>Paramètres</span>
      </ButtonLink>
    </nav>
  );
};

export default Menu;
