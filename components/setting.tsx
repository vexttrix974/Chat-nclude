import "../styles/output.css";
import Button02 from './button_02';

export default function setting() {
  return (
    <div className="w-8/12 h-screen rounded-xl ml-[20%] bg-white ">
      
      <img
        src="https://ih1.redbubble.net/image.1523726050.6716/flat,750x,075,f-pad,750x1000,f8f8f8.jpg"
        className="object-cover ml-[8%] mt-8 h-1/3 w-1/4 rounded-full"
        alt=""
      />
      <p className="text-4xl flex justify-center -mt-[15%] ">Nom d'utilisateur</p>
      <form className="mt-[20%] ml-[20%]">
        <p>Qu'est-ce que les autres doivent savoir sur vous ?</p>
          <textarea id="story" name="story" rows={10} cols={80} className="border  border-black">
            
          </textarea>
          <div className="flex justify-center">
              <Button02 title={"Enregistrer"}/>
          </div>
      </form>
    </div>
  );
}
