import { Users } from './otherUsers';

export function UserFilter(props) {
  return (
    <main className='bg-secondary'>
      <Users userName={props.userName} />
    </main>
  );
}