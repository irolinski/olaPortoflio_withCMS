DROP TABLE IF EXISTS SERIES;

CREATE TABLE SERIES(
NAME VARCHAR (112),
SLIDES VARCHAR ARRAY,
URL VARCHAR (512),
IMGURL VARCHAR (512)
);


INSERT INTO SERIES(NAME, SLIDES, URL, IMGURL) VALUES 
(
'Streets of Morocco',
'{
   "https://res.cloudinary.com/dtjtqp7r1/image/upload/v1712437326/z-Ola%20K.-Portfolio/MAROCO/z5lm7gdg3ubhyz39dbhp.jpg",
    "https://res.cloudinary.com/dtjtqp7r1/image/upload/v1712437335/z-Ola%20K.-Portfolio/MAROCO/hdmubbl403sznvu4nklk.jpg",
    "https://res.cloudinary.com/dtjtqp7r1/image/upload/v1712437337/z-Ola%20K.-Portfolio/MAROCO/kpaf2w5qjnwr9hwmwhkx.jpg",
    "https://res.cloudinary.com/dtjtqp7r1/image/upload/v1712437333/z-Ola%20K.-Portfolio/MAROCO/eq7ic3kqxjrnvaym5lj5.jpg",
    "https://res.cloudinary.com/dtjtqp7r1/image/upload/v1712437334/z-Ola%20K.-Portfolio/MAROCO/rvxfl3dwu2bwkqy1nvbj.jpg",
    "https://res.cloudinary.com/dtjtqp7r1/image/upload/v1712437334/z-Ola%20K.-Portfolio/MAROCO/xpw5fwxhgduiv6zj2gqj.jpg",
    "https://res.cloudinary.com/dtjtqp7r1/image/upload/v1712437325/z-Ola%20K.-Portfolio/MAROCO/pshyehzxkdbjhbk1rdqz.jpg"
}',
'/#/projekty/Streets',
'https://res.cloudinary.com/dtjtqp7r1/image/upload/v1712437337/z-Ola%20K.-Portfolio/MAROCO/kpaf2w5qjnwr9hwmwhkx.jpg'
);

;



