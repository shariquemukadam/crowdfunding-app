import Image from 'next/image';

export default function FloatingIcon() {
  return (
    <div>
      <Image src="/icon.png" alt="Floating Icon" width={50} height={50} />
    </div>
  );
}