using Microsoft.AspNetCore.Mvc;
using System;
using System.Diagnostics;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MySqlConnector;
using MySqlConnector.Authentication;
using MySqlConnector.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Converters;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HeroHQ
{
    public class newHero
    {
        public string Nom { get; set; }
        public int Age { get; set; }
        public string Pouvoir { get; set; }
        public string Citation { get; set; }
        public string Photo { get; set; }
    }
    public class Hero
    {
        public int Id;
        public string Nom;
        public int Age;
        public string Pouvoir;
        public string Citation;
        public string Photo;
    }
    public class HeroShort
    {
        public int Id;
        public string Nom;
        public string Photo;
    }

    [Route("[controller]")]
    [ApiController]
    public class DatabaseController : ControllerBase
    {
        private MySqlConnector.MySqlConnection mySqlConnection;
        private Random randomer;

        private int randomInteger(int min, int max)
        {
            return randomer.Next(min, max+1);
        }

        public DatabaseController()
        {
            this.randomer = new Random();
            try
            {
                this.mySqlConnection = new MySqlConnection("Server=localhost;User ID=root;Password=;Database=herohq");
                this.mySqlConnection.Open();
            }
            catch (Exception er)
            {
            }
        }

        [HttpGet]
        public string Get()
        {
            return this.GetAll();
        }

        [HttpGet("all")]
        public string GetAll()
        {
            List<Hero> tab = new List<Hero>();
            using (var command = new MySqlCommand("SELECT Id, Nom, Age, Pouvoir, Citation, Photo FROM bdd_hero", this.mySqlConnection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        tab.Add(new Hero()
                        {
                            Id = reader.GetInt32(0),
                            Nom = reader.GetString(1),
                            Age = reader.GetInt32(2),
                            Pouvoir = reader.GetString(3),
                            Citation = reader.GetString(4),
                            Photo = reader.GetString(5)
                        });
                    }
                }
            }

            return JsonConvert.SerializeObject(tab);
        }

        [HttpGet("allResume")]
        public string GetAllResume()
        {
            List<HeroShort> tab = new List<HeroShort>();
            using (var command = new MySqlCommand("SELECT Id, Nom, Photo FROM bdd_hero", this.mySqlConnection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        tab.Add(new HeroShort()
                        {
                            Id = reader.GetInt32(0),
                            Nom = reader.GetString(1),
                            Photo = reader.GetString(2)
                        });
                    }
                }
            }
            return JsonConvert.SerializeObject(tab);
        }

        [HttpGet("search/{pattern}")]
        public string Search(string pattern)
        {
            List<HeroShort> tab = new List<HeroShort>();
            using (var command = new MySqlCommand("SELECT Id, Nom, Photo FROM bdd_hero WHERE LOWER(Nom) LIKE '%" + pattern.Trim().ToLower() + "%'", this.mySqlConnection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        tab.Add(new HeroShort()
                        {
                            Id = reader.GetInt32(0),
                            Nom = reader.GetString(1),
                            Photo = reader.GetString(2)
                        });
                    }
                }
            }
            return JsonConvert.SerializeObject(tab);
        }

        [HttpGet("random/{quantity}")]
        public string GetRandom(int quantity)
        {
            return this.GetRandom(quantity, false);
        }

        [HttpGet("random/{quantity}/{complete}")]
        public string GetRandom(int quantity, bool complete = false)
        {
            List<Hero> tab1 = new List<Hero>();
            List<HeroShort> tab2 = new List<HeroShort>();
            List<int> availlableIdList = new List<int>();
            List<int> idList = new List<int>();
            int min = 999999999;
            int max = 0;
            int tmpv = 0;

            using (var command = new MySqlCommand("SELECT Id FROM bdd_hero ORDER BY Id DESC", this.mySqlConnection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        tmpv = reader.GetInt32(0);
                        if (tmpv > max) { max = tmpv; }
                        if (tmpv < min) { min = tmpv; }
                        availlableIdList.Add(tmpv);
                    }
                }
            }
            int rnd = this.randomInteger(min, max); ;

            if (quantity > 0) for (int i = 0; i < quantity; i++)
                {
                    while (idList.Contains(rnd) || !availlableIdList.Contains(rnd))
                    {
                        rnd = this.randomInteger(min, max);
                    }
                    idList.Add(rnd);
                }
            string query = "SELECT ";
            if (complete == true) { query += "Id, Nom, Age, Pouvoir, Citation, Photo"; }
            else { query += "Id, Nom, Photo"; }
            query += " FROM bdd_hero WHERE Id IN(" + JsonConvert.SerializeObject(idList.ToArray()).Replace("[", "").Replace("]", "") + ") ORDER BY case";
            for (int i = 0; i < quantity; i++) {
                query += " when Id = " + idList [i] + " then " + i;
            }
            query += " else " + quantity + " end ASC";

            using (var command2 = new MySqlCommand(query, this.mySqlConnection))
            {
                using (var reader2 = command2.ExecuteReader())
                {
                    while (reader2.Read())
                    {
                        if (complete == true)
                            tab1.Add(new Hero()
                            {
                                Id = reader2.GetInt32(0),
                                Nom = reader2.GetString(1),
                                Age = reader2.GetInt32(2),
                                Pouvoir = reader2.GetString(3),
                                Citation = reader2.GetString(4),
                                Photo = reader2.GetString(5)
                            });
                        else
                            tab2.Add(new HeroShort()
                            {
                                Id = reader2.GetInt32(0),
                                Nom = reader2.GetString(1),
                                Photo = reader2.GetString(2)
                            });
                    }
                }
            }

            if (complete == true) { return JsonConvert.SerializeObject(tab1); }
            else { return JsonConvert.SerializeObject(tab2); }
        }

        // GET /<DatabaseController>/hero/{id}
        [HttpGet("hero/{id}")]
        public string GetHero(int id)
        {
            Hero tab = null;
            try
            {
                using (var command = new MySqlCommand("SELECT Id, Nom, Age, Pouvoir, Citation, Photo FROM bdd_hero WHERE Id = " + id, this.mySqlConnection))
                using (var reader = command.ExecuteReader())
                {
                    reader.Read();
                    tab = new Hero()
                    {
                        Id = reader.GetInt32(0),
                        Nom = reader.GetString(1),
                        Age = reader.GetInt32(2),
                        Pouvoir = reader.GetString(3),
                        Citation = reader.GetString(4),
                        Photo = reader.GetString(5)
                    };
                }
                return JsonConvert.SerializeObject(tab);
            }
            catch (Exception) { return ""; }
        }

        // POST api/<DatabaseController>
        [HttpPost]
        public string Post([FromBody] string value)
        {
            return value;
        }

        // POST api/<DatabaseController>
        [HttpPost("register")]
        public int Register(newHero data)
        {
            System.Diagnostics.Debug.WriteLine("data = " + JsonConvert.SerializeObject(data));
            try
            {
                System.Diagnostics.Debug.WriteLine("Nom = " + data.Nom);
                string query = "INSERT INTO bdd_hero(Nom, Age, Pouvoir, Citation, Photo) VALUES('"+ data.Nom + "', " + data.Age + ", '" + data.Pouvoir + "', '" + data.Citation + "', '" + data.Photo + "')";

                using (var command = new MySqlCommand(query, this.mySqlConnection))
                using (var reader = command.ExecuteReader())
                {
                    return (int)command.LastInsertedId;
                }

                return 0;
            }
            catch (Exception err) {
                System.Diagnostics.Debug.WriteLine(JsonConvert.SerializeObject(err));

                return 0;
            }
        }

        // PUT api/<DatabaseController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<DatabaseController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
